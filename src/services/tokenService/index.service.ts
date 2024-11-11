import * as jwt from "jsonwebtoken";

import config from "@config/index";
import { Token } from "@db/entities/Token.entity";
import { db } from "@db/index";
import { TokenPayload } from "@typeDeclarations/token";

import { TokenServiceInterface } from "./index.interface";

export class TokenService implements TokenServiceInterface {
  generateTokens(payload: TokenPayload, accessTokenOnly = false) {
    const { accessToken: accessTokenConfig, refreshToken: refreshTokenConfig } = config.jwt;

    const accessToken = jwt.sign(payload, accessTokenConfig.secret, {
      expiresIn: accessTokenConfig.expiresIn
    });

    if (accessTokenOnly) return { accessToken };

    const refreshToken = jwt.sign(payload, refreshTokenConfig.secret, {
      expiresIn: refreshTokenConfig.expiresIn
    });

    return { accessToken, refreshToken };
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
}
