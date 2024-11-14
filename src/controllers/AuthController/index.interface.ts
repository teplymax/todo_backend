import { LoginPayload, RegisterPayload, RegisterResponse, VerifyPayload, VerifyResponse } from "@typeDeclarations/auth";
import { AppRequestHandler } from "@typeDeclarations/common";

export interface AuthControllerInterface {
  register: AppRequestHandler<RegisterResponse, RegisterPayload>;
  resendVerification: AppRequestHandler<unknown, unknown>;
  verify: AppRequestHandler<VerifyResponse, VerifyPayload>;
  login: AppRequestHandler<LoginPayload>;
  logout: AppRequestHandler;
  refresh: AppRequestHandler;
}
