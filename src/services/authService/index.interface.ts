import { LoginPayload, RegisterPayload } from "@typeDeclarations/auth";

export interface AuthServiceInterface {
  register: (payload: RegisterPayload) => void;
  login: (payload: LoginPayload) => void;
  verify: () => void;
  logout: () => void;
  refresh: () => void;
}
