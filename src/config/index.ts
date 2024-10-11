import { Config } from "../types/config";
import dotenv from "dotenv";

dotenv.config();

const config: Config = {
  db: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
  },
};

export default config;
