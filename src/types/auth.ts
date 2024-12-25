import { User } from "@db/entities/User.entity";

export interface RegisterPayload {
  email: string;
  nickname: string;
  password: string;
  name?: string;
  surname?: string;
  birthdayDate?: string;
}

export type MappedUser = Omit<User, "verificationCode" | "password" | "token">;

export interface RegisterResponse {
  accessToken: string;
  user: MappedUser;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface VerifyPayload {
  verificationCode: string;
}

export interface GenericSuccessfulLoginResponse {
  accessToken: string;
  user: MappedUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface VerificationEmailWorkerData {
  email: string;
  code: string;
}
