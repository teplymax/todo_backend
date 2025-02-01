import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import { UserMapper } from "@services/userService/user.mapper";
import { AppRequestHandler } from "@typeDeclarations/common";
import { EditUserAccountPayload, EditUserAccountResponse, GetUserAccountResponse } from "@typeDeclarations/user";
import { generateResponse } from "@utils/common/generateResponse";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

import { AccountControllerInterface } from "./index.interface";

class AccountController implements AccountControllerInterface {
  private getUserId(authorization: string): string {
    const token = extractTokenFromAuthHeader(authorization);
    return TokenServiceSingleton.getInstance().decodeToken(token).id;
  }

  getAccount: AppRequestHandler<GetUserAccountResponse> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      const user = await UserServiceSingleton.getInstance().getUserById(userId);

      res.status(200).json(
        generateResponse({
          user: UserMapper.getInstance().map(user)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  editAccount: AppRequestHandler<EditUserAccountResponse, EditUserAccountPayload> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      const user = await UserServiceSingleton.getInstance().editUser(userId, req.body);

      res.status(200).json(
        generateResponse({
          user: UserMapper.getInstance().map(user)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  deleteAccount: AppRequestHandler = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");

      await UserServiceSingleton.getInstance().deleteUser(userId);
      await TokenServiceSingleton.getInstance().removeToken(userId);

      res.clearCookie("refreshToken").status(200).json(generateResponse());
    } catch (error) {
      next(error);
    }
  };
}

export const accountController = new AccountController();
