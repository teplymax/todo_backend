import { User } from "@db/entities/User.entity";
import { LoginPayload, RegisterPayload, VerifyPayload } from "@typeDeclarations/auth";

export interface AuthServiceInterface {
  register: (payload: RegisterPayload) => Promise<User>;
  login: (payload: LoginPayload) => void;
  verify: (payload: VerifyPayload, userId: string) => Promise<User>;
  resendVerification: (userId: string) => Promise<string>;
  logout: () => void;
  refresh: () => void;
}
