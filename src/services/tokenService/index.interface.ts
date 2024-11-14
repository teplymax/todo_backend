import { Token } from "@db/entities/Token.entity";
import { VerifyTokenPayload, TokenPayload, TokensPair } from "@typeDeclarations/token";

export interface TokenServiceInterface {
  generateTokens: (payload: TokenPayload, accessTokenOnly?: boolean) => TokensPair;
  verifyToken: (payload: VerifyTokenPayload) => Promise<TokenPayload>;
  saveToken: (userId: string, refreshToken: string) => Promise<Token>;
}
