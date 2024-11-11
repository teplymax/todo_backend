import { Token } from "@db/entities/Token.entity";
import { TokenPayload, TokensPair } from "@typeDeclarations/token";

export interface TokenServiceInterface {
  generateTokens: (payload: TokenPayload, accessTokenOnly?: boolean) => TokensPair;
  saveToken: (userId: string, refreshToken: string) => Promise<Token>;
}
