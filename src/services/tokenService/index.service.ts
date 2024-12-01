import jwt from "jsonwebtoken";

import config from "@config/index";
import { Token } from "@db/entities/Token.entity";
import { db } from "@db/index";
import { Config } from "@typeDeclarations/config";
import { TokenPayload, VerifyTokenPayload } from "@typeDeclarations/token";
import { APIError } from "@utils/errors/apiError";

import { TokenServiceInterface } from "./index.interface";

export class TokenService implements TokenServiceInterface {
  private jwtConfig: Config["jwt"];

  constructor() {
    this.jwtConfig = config.jwt;
  }

  generateTokens(payload: TokenPayload, accessTokenOnly = false) {
    const { accessToken: accessTokenConfig, refreshToken: refreshTokenConfig } = this.jwtConfig;

    const accessToken = jwt.sign(payload, accessTokenConfig.secret, {
      expiresIn: accessTokenConfig.expiresIn
    });

    if (accessTokenOnly) return { accessToken };

    const refreshToken = jwt.sign(payload, refreshTokenConfig.secret, {
      expiresIn: refreshTokenConfig.expiresIn
    });

    return { accessToken, refreshToken };
  }

  verifyToken({ tokenType, token }: VerifyTokenPayload) {
    return new Promise<TokenPayload>((resolve, reject) => {
      const { secret } = this.jwtConfig[tokenType];

      jwt.verify(token, secret, (error, decoded) => {
        if (!error && decoded) {
          resolve(decoded as TokenPayload);
        } else {
          reject(new APIError("Invalid token.", 401, error?.message));
        }
      });
    });
  }

  decodeToken(token: string) {
    return jwt.decode(token) as TokenPayload;
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokensRepository = db.getRepository(Token);

    const token = await tokensRepository.findOne({
      where: {
        user: {
          id: userId
        }
      }
    });

    if (token) {
      token.refreshToken = refreshToken;
      return await tokensRepository.save(token);
    }

    const newToken = tokensRepository.create({
      refreshToken,
      user: {
        id: userId
      }
    });

    return await tokensRepository.save(newToken);
  }

  async removeToken(userId: string) {
    const tokensRepository = db.getRepository(Token);

    const token = await tokensRepository.findOne({
      where: {
        user: {
          id: userId
        }
      }
    });

    if (token) {
      await tokensRepository.remove(token);
    }
  }
}
