# Database migrations

The schema is built by numbered SQL files in `migrations/`. The server applies
any that have not run yet every time it starts, and `npm run migrate` does the
same without starting the server.

Rules:

1. Never edit a migration that has already been applied anywhere (including your
   own machine). The runner stores a checksum and will refuse to start if it changes.
2. To change the schema, add the next numbered file, for example
   `002_add_tank_low_level.sql`, containing only the change.
3. Keep each file small. MySQL cannot roll back schema changes, so a file that
   fails halfway leaves the database half-changed.

Demo data (development only): `npm run db:seed-demo`. It does nothing if the
database already has a station.
