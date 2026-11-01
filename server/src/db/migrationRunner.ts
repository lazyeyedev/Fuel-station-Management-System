import fs from "fs";
import path from "path";
import crypto from "crypto";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// server/src/db -> server/database/migrations (same depth when compiled to dist/db)
const MIGRATIONS_DIR = path.resolve(__dirname, "../../database/migrations");

function checksum(sql: string): string {
  // Normalise line endings so Windows/Git CRLF conversion never looks like an edit
  const normalised = sql.replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(normalised).digest("hex");
}

function connectionBase() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  };
}

export function getDatabaseName(): string {
  const name = process.env.DB_NAME || "fuel_station_db";

  if (!/^[A-Za-z0-9_]+$/.test(name)) {
    throw new Error(
      "DB_NAME may only contain letters, numbers and underscores"
    );
  }

  return name;
}

export async function runMigrations(): Promise<void> {
  const dbName = getDatabaseName();

  // 1. Make sure the database itself exists
  const admin = await mysql.createConnection(connectionBase());
  await admin.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await admin.end();

  const conn = await mysql.createConnection({
    ...connectionBase(),
    database: dbName,
    multipleStatements: true,
  });

  try {
    // 2. Bookkeeping table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) NOT NULL PRIMARY KEY,
        checksum CHAR(64) NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => /^\d+_.+\.sql$/.test(f))
      .sort();

    const [rows] = await conn.query<RowDataPacket[]>(
      "SELECT filename, checksum FROM schema_migrations"
    );

    const applied = new Map<string, string>(
      rows.map((r) => [r.filename as string, r.checksum as string])
    );

    // 3. Baseline: a database built by the old schema.sql already has the
    //    001 tables, so record 001 as applied instead of running it again.
    if (applied.size === 0 && files.length > 0) {
      const [found] = await conn.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS n FROM information_schema.tables
          WHERE table_schema = ? AND table_name = 'stations'`,
        [dbName]
      );

      if (Number(found[0].n) > 0) {
        const first = files[0];
        const sum = checksum(
          fs.readFileSync(path.join(MIGRATIONS_DIR, first), "utf8")
        );

        await conn.query(
          "INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)",
          [first, sum]
        );

        applied.set(first, sum);
        console.log(
          `[migrate] Existing database detected: ${first} recorded as already applied`
        );
      }
    }

    // 4. Apply anything new, in order
    let ran = 0;

    for (const file of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      const sum = checksum(sql);
      const previous = applied.get(file);

      if (previous) {
        if (previous !== sum) {
          throw new Error(
            `Migration ${file} was edited after it was applied. ` +
              `Put your change in a new numbered migration instead.`
          );
        }
        continue;
      }

      console.log(`[migrate] Applying ${file}`);
      await conn.query(sql);
      await conn.query(
        "INSERT INTO schema_migrations (filename, checksum) VALUES (?, ?)",
        [file, sum]
      );
      ran++;
    }

    console.log(
      ran === 0
        ? "[migrate] Database is up to date"
        : `[migrate] Applied ${ran} migration(s)`
    );
  } finally {
    await conn.end();
  }
}
