import pool from "../config/database";

export async function getAttendants(stationId: number) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        station_id,
        employee_number,
        full_name,
        phone,
        active,
        created_at
      FROM attendants
      WHERE station_id = ?
        AND active = 1
      ORDER BY full_name
    `,
    [stationId]
  );

  return rows;
}

interface CreateAttendantData {
  stationId: number;
  fullName: string;
  phone?: string | null;
  employeeNumber?: string | null;
}

export async function createAttendant(data: CreateAttendantData) {
  const [result] = await pool.query(
    `
      INSERT INTO attendants (
        station_id,
        employee_number,
        full_name,
        phone,
        active
      )
      VALUES (?, ?, ?, ?, 1)
    `,
    [
      data.stationId,
      data.employeeNumber ?? null,
      data.fullName,
      data.phone ?? null,
    ]
  );

  const insertId = (result as { insertId: number }).insertId;

  const [rows] = await pool.query(
    `
      SELECT
        id,
        station_id,
        employee_number,
        full_name,
        phone,
        active,
        created_at
      FROM attendants
      WHERE id = ?
    `,
    [insertId]
  );

  return (rows as unknown[])[0];
}

export async function deactivateAttendant(id: number) {
  await pool.query(
    `UPDATE attendants SET active = 0 WHERE id = ?`,
    [id]
  );
}
