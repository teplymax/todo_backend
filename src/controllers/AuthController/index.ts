import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import { RegisterPayload, LoginPayload, RegisterResponse } from "@typeDeclarations/auth";
import { AppRequestHandler } from "@typeDeclarations/common";

import { AuthControllerInterface } from "./index.interface";

class AuthController implements AuthControllerInterface {
  register: AppRequestHandler<RegisterResponse, RegisterPayload> = async (req, res, next) => {
    try {
      const user = await UserServiceSingleton.getInstance().createUser(req.body);
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

  verify: AppRequestHandler = (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  login: AppRequestHandler<LoginPayload> = (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  logout: AppRequestHandler = (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  refresh: AppRequestHandler = (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
