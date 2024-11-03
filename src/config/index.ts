import dotenv from "dotenv";

import { Config } from "../types/config";

dotenv.config();

const config: Config = {
  mode: process.env.NODE_ENV,
  db: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
  }
};

export default config;
