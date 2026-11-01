const API_BASE_URL = "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "API request failed"
    );
  }

  return data;
}

export interface ShiftOptionNozzle {
  id: number;
  pump_id: number;
  fuel_type_id: number;
  nozzle_number: number;
  nozzle_name: string;
  pump_number: number;
  pump_name: string;
  fuel_type_code: string;
  fuel_type_name: string;
}

export interface ShiftOptionAttendant {
  id: number;
  employee_number: string | null;
  full_name: string;
  phone: string | null;
}

export interface ShiftOptions {
  nozzles: ShiftOptionNozzle[];
  attendants: ShiftOptionAttendant[];
}

export interface Shift {
  id: number;
  station_id: number;
  station_name: string;
  station_code: string;
  shift_date: string;
  shift_type: "MORNING" | "AFTERNOON" | "NIGHT";
  manager_id: number | null;
  status: "OPEN" | "CLOSED" | "LOCKED";
  opened_at: string;
  closed_at: string | null;
  created_at: string;
}

export interface CreateShiftAssignment {
  nozzleId: number;
  attendantId: number;
}

export interface CreateShiftPayload {
  stationId: number;
  shiftDate: string;
  shiftType:
    | "MORNING"
    | "AFTERNOON"
    | "NIGHT";
  managerId?: number | null;
  assignments: CreateShiftAssignment[];
}

export async function getShiftOptions(
  stationId: number
): Promise<ShiftOptions> {
  const response = await request<{
    success: boolean;
    data: ShiftOptions;
  }>(`/shifts/options/${stationId}`);

  return response.data;
}

export async function getShifts(
  stationId?: number
): Promise<Shift[]> {
  const endpoint = stationId
    ? `/shifts?stationId=${stationId}`
    : "/shifts";

  const response = await request<{
    success: boolean;
    data: Shift[];
  }>(endpoint);

  return response.data;
}

export async function createShift(
  payload: CreateShiftPayload
) {
  return request<{
    success: boolean;
    message: string;
    data: {
      id: number;
    };
  }>("/shifts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* =========================
   ATTENDANTS
========================= */

export interface Attendant {
  id: number;
  station_id: number;
  employee_number: string | null;
  full_name: string;
  phone: string | null;
  active: boolean;
  created_at: string;
}

export interface CreateAttendantPayload {
  stationId: number;
  fullName: string;
  phone?: string | null;
  employeeNumber?: string | null;
}

export async function getAttendants(
  stationId: number
): Promise<Attendant[]> {
  const response = await request<{
    success: boolean;
    data: Attendant[];
  }>(`/attendants?stationId=${stationId}`);

  return response.data;
}

export async function createAttendant(
  payload: CreateAttendantPayload
): Promise<Attendant> {
  const response = await request<{
    success: boolean;
    message: string;
    data: Attendant;
  }>("/attendants", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deactivateAttendant(
  id: number
): Promise<void> {
  await request<{
    success: boolean;
    message: string;
  }>(`/attendants/${id}/deactivate`, {
    method: "PATCH",
  });
}
