import path from "path";

import { DataSource } from "typeorm";

import config, { IS_PROD } from "@config";

async function initializeDatabase() {
  const ext = path.extname(import.meta.url);
  const rootDir = IS_PROD ? "src/dist" : "src";

  const db = new DataSource({
    ...config.db,
    type: "postgres",
    entities: [`${rootDir}/db/entities/*${ext}`],
    logging: false,
    synchronize: true
  });

  const instance = await db.initialize();

  console.log("DB initialized!");

  return instance;
}

const db = await initializeDatabase();

export { db };
