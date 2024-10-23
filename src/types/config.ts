export type Environment = "development" | "production";

interface DBConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export interface Config {
  readonly mode: Environment;
  readonly db: DBConfig;
}
