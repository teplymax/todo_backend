import { LoginPayload, RegisterPayload, RegisterResponse } from "@typeDeclarations/auth";
import { AppRequestHandler } from "@typeDeclarations/common";

export interface AuthControllerInterface {
  register: AppRequestHandler<RegisterResponse, RegisterPayload>;
  login: AppRequestHandler<LoginPayload>;
  logout: AppRequestHandler;
  refresh: AppRequestHandler;
}
