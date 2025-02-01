import { User } from "@db/entities/User.entity";

export type MappedUser = Omit<User, "verificationCode" | "password" | "token">;

export interface GetUserAccountResponse {
  user: MappedUser;
}

export interface EditUserAccountPayload {
  email?: string;
  nickname?: string;
  name?: string;
  surname?: string;
  birthdayDate?: string;
}

export interface EditUserAccountResponse {
  user: MappedUser;
}
