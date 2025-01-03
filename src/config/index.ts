import dotenv from "dotenv";

import { Config, Environment } from "@typeDeclarations/config";

const IS_PROD = process.env.NODE_ENV === "production";
const IS_DEV = process.env.NODE_ENV === "development";
const IS_TEST = process.env.NODE_ENV === "test";

const ENV_PATH_MAP: Record<Environment, string> = {
  production: ".env",
  development: ".env",
  test: ".env.test"
};

dotenv.config({ path: ENV_PATH_MAP[process.env.NODE_ENV] });

const config: Config = {
  mode: process.env.NODE_ENV,
  port: process.env.PORT,

  db: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    dropSchema: IS_TEST
  },

  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME
    }
  },

  mailer: {
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD
    }
  }
};

export default config;
export { IS_PROD, IS_DEV, IS_TEST };
