import {
  LoginPayload,
  GenericSuccessfulLoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyPayload,
  RefreshTokenResponse
} from "@typeDeclarations/auth";
import { AppRequestHandler } from "@typeDeclarations/common";

export interface AuthControllerInterface {
  register: AppRequestHandler<RegisterResponse, RegisterPayload>;
  resendVerification: AppRequestHandler;
  verify: AppRequestHandler<GenericSuccessfulLoginResponse, VerifyPayload>;
  login: AppRequestHandler<GenericSuccessfulLoginResponse, LoginPayload>;
  refresh: AppRequestHandler<RefreshTokenResponse>;
  logout: AppRequestHandler;
}
