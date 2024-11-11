import { User } from "@db/entities/User.entity";

export interface RegisterPayload {
  email: string;
  nickname: string;
  password: string;
  name?: string;
  surname?: string;
  birthdayDate?: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  login: string;
  password: string;
}
