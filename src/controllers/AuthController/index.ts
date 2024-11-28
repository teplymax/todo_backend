import { Response } from "express";

import config from "@config/index";
import { AuthServiceSingleton } from "@services/authService";
import { MailerServiceSingleton } from "@services/mailerService";
import { TokenServiceSingleton } from "@services/tokenService";
import {
  GenericSuccessfulLoginResponse,
  LoginPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyPayload
} from "@typeDeclarations/auth";
import { AppRequestHandler } from "@typeDeclarations/common";
import { extractTokenFromAuthHeader, parseTokenExpTimeToMs } from "@utils/stringUtils";

import { AuthControllerInterface } from "./index.interface";

class AuthController implements AuthControllerInterface {
  private sendAuthorizedUserResponse(
    res: Response<GenericSuccessfulLoginResponse>,
    payload: GenericSuccessfulLoginResponse & {
      refreshToken: string | undefined;
    }
  ) {
    res
      .cookie("refreshToken", payload.refreshToken, {
        maxAge: parseTokenExpTimeToMs(config.jwt.refreshToken.expiresIn),
        httpOnly: true
      })
      .status(200)
      .json({
        accessToken: payload.accessToken,
        user: payload.user
      });
  }

  register: AppRequestHandler<RegisterResponse, RegisterPayload> = async (req, res, next) => {
    try {
      const user = await AuthServiceSingleton.getInstance().register(req.body);
      await MailerServiceSingleton.getInstance().sendVerificationEmail(req.body.email, user.verificationCode as string);
      const { accessToken } = TokenServiceSingleton.getInstance().generateTokens(
        {
          id: user.id,
          email: user.email,
          nickname: user.nickname
        },
        true
      );

      res.status(201).json({
        accessToken,
        user
      });
    } catch (error) {
      next(error);
    }
  };

  verify: AppRequestHandler<GenericSuccessfulLoginResponse, VerifyPayload> = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({ token, tokenType: "accessToken" });
      const user = await AuthServiceSingleton.getInstance().verify(req.body, tokenPayload.id);
      const { accessToken, refreshToken } = TokenServiceSingleton.getInstance().generateTokens({
        id: user.id,
        email: user.email,
        nickname: user.nickname
      });
      await TokenServiceSingleton.getInstance().saveToken(user.id, refreshToken as string);

      this.sendAuthorizedUserResponse(res, {
        accessToken,
        user,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  };

  login: AppRequestHandler<GenericSuccessfulLoginResponse, LoginPayload> = async (req, res, next) => {
    try {
      const user = await AuthServiceSingleton.getInstance().login(req.body);

      try {
        const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({
          token: user.token.refreshToken ?? "",
          tokenType: "refreshToken"
        });
        const { accessToken } = TokenServiceSingleton.getInstance().generateTokens(tokenPayload, true);

        this.sendAuthorizedUserResponse(res, {
          accessToken,
          user,
          refreshToken: user.token.refreshToken ?? ""
        });
      } catch (error) {
        const { accessToken, refreshToken } = TokenServiceSingleton.getInstance().generateTokens({
          id: user.id,
          email: user.email,
          nickname: user.nickname
        });
        await TokenServiceSingleton.getInstance().saveToken(user.id, refreshToken as string);

        this.sendAuthorizedUserResponse(res, {
          accessToken,
          user,
          refreshToken: user.token.refreshToken ?? ""
        });
      }
    } catch (error) {
      next(error);
    }
  };

  refresh: AppRequestHandler<RefreshTokenResponse> = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({ token, tokenType: "accessToken" });
      const { accessToken } = TokenServiceSingleton.getInstance().generateTokens(tokenPayload, true);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  resendVerification: AppRequestHandler<unknown, unknown> = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({ token, tokenType: "accessToken" });
      const verificationCode = await AuthServiceSingleton.getInstance().resendVerification(tokenPayload.id);
      await MailerServiceSingleton.getInstance().sendVerificationEmail(tokenPayload.email, verificationCode);

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };

  logout: AppRequestHandler = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({ token, tokenType: "accessToken" });
      await TokenServiceSingleton.getInstance().removeToken(tokenPayload.id);

      res.clearCookie("refreshToken").status(200).json({});
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
