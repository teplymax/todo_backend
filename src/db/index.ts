import { DataSource } from "typeorm";

import config from "../config";

const db = new DataSource({
  ...config.db,
  type: "postgres",
  entities: ["src/db/entities/*.ts"],
  logging: false,
  synchronize: true
});

db.initialize()
  .then(() => {
    console.log("Database has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Database initialization:", err);
  });

export { db };
