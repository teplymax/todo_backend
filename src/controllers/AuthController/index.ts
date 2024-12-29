import { Worker } from "worker_threads";

import { Response } from "express";

import config from "@config/index";
import { AuthServiceSingleton } from "@services/authService";
import { UserMapper } from "@services/authService/user.mapper";
import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import {
  GenericSuccessfulLoginResponse,
  LoginPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyPayload
} from "@typeDeclarations/auth";
import { AppRequestHandler, BaseResponse } from "@typeDeclarations/common";
import { generateResponse } from "@utils/common/generateResponse";
import { extractTokenFromAuthHeader, parseTokenExpTimeToMs } from "@utils/stringUtils";

import { AuthControllerInterface } from "./index.interface";

class AuthController implements AuthControllerInterface {
  private sendAuthorizedUserResponse(
    res: Response<BaseResponse<GenericSuccessfulLoginResponse>>,
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
      .json(
        generateResponse<GenericSuccessfulLoginResponse>({
          accessToken: payload.accessToken,
          user: payload.user
        })
      );
  }

  private sendVerificationEmail(email: string, code: string) {
    new Worker("./src/workers/VerificationEmailWorker/index.cjs", {
      workerData: {
        email,
        code
      }
    });
  }

  register: AppRequestHandler<RegisterResponse, RegisterPayload> = async (req, res, next) => {
    try {
      const user = await AuthServiceSingleton.getInstance().register(req.body);
      this.sendVerificationEmail(user.email, user.verificationCode as string);
      const { accessToken } = TokenServiceSingleton.getInstance().generateTokens(
        {
          id: user.id,
          email: user.email,
          nickname: user.nickname
        },
        true
      );

      res.status(201).json(
        generateResponse<GenericSuccessfulLoginResponse>({
          accessToken,
          user: UserMapper.getInstance().map(user)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  verify: AppRequestHandler<GenericSuccessfulLoginResponse, VerifyPayload> = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = TokenServiceSingleton.getInstance().decodeToken(token);
      const user = await AuthServiceSingleton.getInstance().verify(req.body, tokenPayload.id);
      const { accessToken, refreshToken } = TokenServiceSingleton.getInstance().generateTokens({
        id: user.id,
        email: user.email,
        nickname: user.nickname
      });
      await TokenServiceSingleton.getInstance().saveToken(user.id, refreshToken as string);

      this.sendAuthorizedUserResponse(res, {
        accessToken,
        refreshToken,
        user: UserMapper.getInstance().map(user)
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
          token: user.token?.refreshToken ?? "",
          tokenType: "refreshToken"
        });
        const { accessToken } = TokenServiceSingleton.getInstance().generateTokens(tokenPayload, true);

        this.sendAuthorizedUserResponse(res, {
          accessToken,
          user: UserMapper.getInstance().map(user),
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
          refreshToken,
          user: UserMapper.getInstance().map(user)
        });
      }
    } catch (error) {
      next(error);
    }
  };

  refresh: AppRequestHandler<RefreshTokenResponse> = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = TokenServiceSingleton.getInstance().decodeToken(token);
      const user = await UserServiceSingleton.getInstance().getUserById(tokenPayload.id);
      await TokenServiceSingleton.getInstance().verifyToken({
        token: user?.token?.refreshToken ?? "",
        tokenType: "refreshToken"
      });
      const { accessToken } = TokenServiceSingleton.getInstance().generateTokens(tokenPayload, true);

      res.status(200).json(generateResponse<RefreshTokenResponse>({ accessToken }));
    } catch (error) {
      next(error);
    }
  };

  resendVerification: AppRequestHandler<unknown, unknown> = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = TokenServiceSingleton.getInstance().decodeToken(token);
      const verificationCode = await AuthServiceSingleton.getInstance().resendVerification(tokenPayload.id);
      this.sendVerificationEmail(tokenPayload.email, verificationCode);

      res.status(200).json(generateResponse());
    } catch (error) {
      next(error);
    }
  };

  logout: AppRequestHandler = async (req, res, next) => {
    try {
      const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

      const tokenPayload = TokenServiceSingleton.getInstance().decodeToken(token);
      await TokenServiceSingleton.getInstance().removeToken(tokenPayload.id);

      res.clearCookie("refreshToken").status(200).json(generateResponse());
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
