import { Pool } from "pg";

const db = new Pool({
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "mydb",
});

export { db };
