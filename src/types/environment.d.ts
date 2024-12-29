import { Environment } from "./config";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: Environment;
      PORT: string;
      DB_NAME: string;
      DB_PORT: string;
      DB_HOST: string;
      DB_USER_NAME: string;
      DB_PASSWORD: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRATION_TIME: string;
      JWT_REFRESH_EXPIRATION_TIME: string;
      MAILER_USER: string;
      MAILER_PASSWORD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
