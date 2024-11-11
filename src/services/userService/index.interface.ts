import { User } from "@db/entities/User.entity";
import { RegisterPayload } from "@typeDeclarations/auth";

export interface UserServiceInterface {
  createUser: (payload: RegisterPayload) => Promise<User>;
}
