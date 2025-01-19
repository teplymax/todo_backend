import { NextFunction, Request, Response } from "express";

import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import { Cookies } from "@typeDeclarations/common";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const accessToken = extractTokenFromAuthHeader(req.headers.authorization ?? "");
    const refreshToken = (req?.cookies as Cookies)?.refreshToken;

    await TokenServiceSingleton.getInstance().verifyToken({ token: refreshToken, tokenType: "refreshToken" });
    const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({
      token: accessToken,
      tokenType: "accessToken"
    });
    await UserServiceSingleton.getInstance().getUserById(tokenPayload.id); // Throws APIError if user is not found

    next();
  } catch (error) {
    if (error instanceof APIError) {
      const additionalInfo = `${error.message}|${error.additionalInfo || ""}`;

      next(new APIError("Unauthorised", 401, additionalInfo));
    } else {
      next(error);
    }
  }
}
