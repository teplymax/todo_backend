import { NextFunction, Request, Response } from "express";

import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
import { APIError } from "@utils/errors/apiError";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractTokenFromAuthHeader(req.headers.authorization ?? "");

    const tokenPayload = await TokenServiceSingleton.getInstance().verifyToken({ token, tokenType: "accessToken" });
    await UserServiceSingleton.getInstance().getUserById(tokenPayload.id); // Throws APIError if user is not found

    next();
  } catch (error) {
    console.log(error);

    if (error instanceof APIError) {
      const additionalInfo = `${error.message}|${error.additionalInfo || ""}`;

      next(new APIError("Unauthorised", 401, additionalInfo));
    } else {
      next(error);
    }
  }
}
