import path from "path";

import { DataSource } from "typeorm";

import config from "@config";

async function initializeDatabase() {
  const ext = path.extname(import.meta.url);

  const db = new DataSource({
    ...config.db,
    type: "postgres",
    entities: [`src/db/entities/*${ext}`],
    logging: false,
    synchronize: true
  });

  return await db.initialize();
}

const db = await initializeDatabase();

export { db };
