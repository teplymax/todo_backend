import config from "@config/index";
import { AuthServiceSingleton } from "@services/authService";
import { MailerServiceSingleton } from "@services/mailerService";
import { TokenServiceSingleton } from "@services/tokenService";
import { LoginPayload, RegisterPayload, RegisterResponse, VerifyPayload, VerifyResponse } from "@typeDeclarations/auth";
import { AppRequestHandler } from "@typeDeclarations/common";
import { extractTokenFromAuthHeader, parseTokenExpTimeToMs } from "@utils/stringUtils";

import { AuthControllerInterface } from "./index.interface";

class AuthController implements AuthControllerInterface {
  login: AppRequestHandler<LoginPayload>;
  logout: AppRequestHandler;
  refresh: AppRequestHandler;

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

  verify: AppRequestHandler<VerifyResponse, VerifyPayload> = async (req, res, next) => {
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

      res
        .cookie("refreshToken", refreshToken as string, {
          maxAge: parseTokenExpTimeToMs(config.jwt.refreshToken.expiresIn),
          httpOnly: true
        })
        .status(200)
        .json({
          accessToken,
          user
        });
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
}

export const authController = new AuthController();
