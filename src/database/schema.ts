export interface Attendant {
  id: string;
  name: string;
  active: boolean;
}

export interface Shift {
  id: string;
  date: string;
  shift: "Morning" | "Afternoon" | "Night";
  manager: string;
}

export interface PumpReading {
  id: string;
  shiftId: string;

  pump: number;
  nozzle: string;

  attendantId: string;

  fuel: "PMS" | "DX1" | "DX2";

  opening: number;
  closing: number;
}

export interface Tank {
  id: string;

  fuel: "PMS" | "DX1" | "DX2";

  opening: number;

  receipts: number;

  dip: number;
}

export interface Payment {
  id: string;

  attendantId: string;

  cash: number;

  momo: number;

  shellCard: number;

  coupon: number;

  credit: number;
}