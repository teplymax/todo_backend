interface DBConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  ssl:
    | {
        ca: string;
      }
    | undefined;
  database: string;
  dropSchema: boolean;
}

interface TokenConfig {
  secret: string;
  expiresIn: string;
}

interface JWTConfig {
  accessToken: TokenConfig;
  refreshToken: TokenConfig;
}

interface MailerConfig {
  auth: {
    user: string;
    pass: string;
  };
  secure: boolean;
  service: string;
}

export interface Config {
  readonly mode: Environment;
  readonly port: string;
  readonly db: DBConfig;
  readonly jwt: JWTConfig;
  readonly mailer: MailerConfig;
}

export type Environment = "development" | "production" | "test";
