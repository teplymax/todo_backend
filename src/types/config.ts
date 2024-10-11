interface DBConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
}
export interface Config {
  readonly db: DBConfig;
}
