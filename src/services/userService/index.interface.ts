import { User } from "@db/entities/User.entity";
import { EditUserAccountPayload } from "@typeDeclarations/user";

export interface UserServiceInterface {
  getUserById: (userId: string) => Promise<User>;
  editUserAccount: (userId: string, payload: EditUserAccountPayload) => Promise<User>;
  deleteUser: (userId: string) => Promise<void>;
  deleteUnverifiedUsers: () => Promise<void>;
}
