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
  user: Omit<User, "verificationCode">;
}

export interface VerifyResponse {
  accessToken: string;
  user: Omit<User, "verificationCode">;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface VerifyPayload {
  verificationCode: string;
}
