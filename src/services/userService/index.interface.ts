import { User } from "@db/entities/User.entity";

export interface UserServiceInterface {
  getUserById: (userId: string) => Promise<User>;
  deleteUnverifiedUsers: () => Promise<void>;
}
