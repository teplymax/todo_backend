import { RegisterPayload, LoginPayload } from "@typeDeclarations/auth";

import { AuthServiceInterface } from "./index.interface";

export class AuthService implements AuthServiceInterface {
  verify: () => void;
  async register(_data: RegisterPayload) {}
  login: (payload: LoginPayload) => void;
  logout: () => void;
  refresh: () => void;
}
