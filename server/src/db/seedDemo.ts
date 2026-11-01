import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";
import { runMigrations, getDatabaseName } from "./migrationRunner";

dotenv.config();

async function main() {
  await runMigrations();

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: getDatabaseName(),
    multipleStatements: true,
  });

  try {
    const [existing] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM stations"
    );

    if (Number(existing[0].n) > 0) {
      console.log("[seed] This database already has a station, so demo data was not added");
      return;
    }

    const sql = fs.readFileSync(
      path.resolve(__dirname, "../../database/seeds/demo.sql"),
      "utf8"
    );

    await conn.query(sql);
    console.log("[seed] Demo data loaded");
  } finally {
    await conn.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exit(1);
  });
