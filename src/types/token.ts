import { Config } from "./config";

export interface TokenPayload {
  nickname: string;
  id: string;
  email: string;
}

export type TokenType = keyof Config["jwt"];

export interface VerifyTokenPayload {
  token: string;
  tokenType: TokenType;
}

export type TokensPair = {
  accessToken: string;
  refreshToken?: string;
};
