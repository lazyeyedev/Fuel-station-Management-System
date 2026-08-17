import pool from "../config/database";

export async function getShifts(stationId?: number) {
  let query = `
    SELECT
      s.id,
      s.station_id,
      st.name AS station_name,
      st.code AS station_code,
      s.shift_date,
      s.shift_type,
      s.manager_id,
      s.status,
      s.opened_at,
      s.closed_at,
      s.created_at
    FROM shifts s
    INNER JOIN stations st ON st.id = s.station_id
  `;

  const params: number[] = [];

  if (stationId) {
    query += ` WHERE s.station_id = ?`;
    params.push(stationId);
  }

  query += ` ORDER BY s.shift_date DESC, s.opened_at DESC`;

  const [rows] = await pool.query(query, params);

  return rows;
}

export async function getShiftById(id: number) {
  const [rows] = await pool.query(
    `
      SELECT
        s.id,
        s.station_id,
        st.name AS station_name,
        st.code AS station_code,
        s.shift_date,
        s.shift_type,
        s.manager_id,
        s.status,
        s.opened_at,
        s.closed_at,
        s.created_at
      FROM shifts s
      INNER JOIN stations st ON st.id = s.station_id
      WHERE s.id = ?
    `,
    [id]
  );

  return rows;
}

export async function getShiftAssignments(shiftId: number) {
  const [rows] = await pool.query(
    `
      SELECT
        sa.id,
        sa.shift_id,
        sa.nozzle_id,
        sa.attendant_id,
        sa.assigned_at,

        a.employee_number,
        a.full_name AS attendant_name,

        n.pump_id,
        n.nozzle_number,
        n.name AS nozzle_name,
        n.fuel_type_id,

        ft.code AS fuel_type_code,
        ft.name AS fuel_type_name,

        p.pump_number,
        p.name AS pump_name

      FROM shift_assignments sa

      INNER JOIN attendants a
        ON a.id = sa.attendant_id

      INNER JOIN nozzles n
        ON n.id = sa.nozzle_id

      INNER JOIN pumps p
        ON p.id = n.pump_id

      LEFT JOIN fuel_types ft
        ON ft.id = n.fuel_type_id

      WHERE sa.shift_id = ?

      ORDER BY p.pump_number, n.nozzle_number
    `,
    [shiftId]
  );

  return rows;
}

export async function getShiftOptions(stationId: number) {
  const [nozzles] = await pool.query(
    `
      SELECT
        n.id,
        n.pump_id,
        n.fuel_type_id,
        n.nozzle_number,
        n.name AS nozzle_name,
        p.pump_number,
        p.name AS pump_name,
        ft.code AS fuel_type_code,
        ft.name AS fuel_type_name
      FROM nozzles n
      INNER JOIN pumps p
        ON p.id = n.pump_id
      INNER JOIN fuel_types ft
        ON ft.id = n.fuel_type_id
      WHERE p.station_id = ?
        AND p.active = 1
        AND n.active = 1
        AND ft.active = 1
      ORDER BY p.pump_number, n.nozzle_number
    `,
    [stationId]
  );

  const [attendants] = await pool.query(
    `
      SELECT
        id,
        employee_number,
        full_name,
        phone
      FROM attendants
      WHERE station_id = ?
        AND active = 1
      ORDER BY full_name
    `,
    [stationId]
  );

  return {
    nozzles,
    attendants,
  };
}

interface CreateShiftData {
  stationId: number;
  shiftDate: string;
  shiftType: "MORNING" | "AFTERNOON" | "NIGHT";
  managerId?: number | null;
  assignments: {
    nozzleId: number;
    attendantId: number;
  }[];
}

export async function createShift(data: CreateShiftData) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [shiftResult] = await connection.query(
      `
        INSERT INTO shifts (
          station_id,
          shift_date,
          shift_type,
          manager_id,
          status
        )
        VALUES (?, ?, ?, ?, 'OPEN')
      `,
      [
        data.stationId,
        data.shiftDate,
        data.shiftType,
        data.managerId ?? null,
      ]
    );

    const shiftId = (shiftResult as { insertId: number }).insertId;

    for (const assignment of data.assignments) {
      await connection.query(
        `
          INSERT INTO shift_assignments (
            shift_id,
            nozzle_id,
            attendant_id
          )
          VALUES (?, ?, ?)
        `,
        [
          shiftId,
          assignment.nozzleId,
          assignment.attendantId,
        ]
      );
    }

    await connection.commit();

    return shiftId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}