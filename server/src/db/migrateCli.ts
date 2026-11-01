import { runMigrations } from "./migrationRunner";

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[migrate] Failed:", error);
    process.exit(1);
  });
