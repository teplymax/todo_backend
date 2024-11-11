export interface TokenPayload {
  nickname: string;
  id: string;
  email: string;
}

export interface TokensPair {
  accessToken: string;
  refreshToken?: string;
}
