export type FuelType = "Super" | "Diesel";

export interface NozzleReading {
  id: string;
  pump: number;
  nozzle: string;
  fuel: FuelType;

  opening: number;
  closing: number;
}

export interface Tank {
  id: string;
  name: string;
  fuel: FuelType;

  capacity: number;

  opening: number;
  receipts: number;
  dip: number;
}

export interface FuelPrices {
  super: number;
  diesel: number;
}

export interface PaymentSummary {
  cash: number;
  momo: number;
  shellCard: number;
  coupon: number;
  credit: number;
}

export interface StationState {
  date: string;

  fuelPrices: FuelPrices;

  nozzles: NozzleReading[];

  tanks: Tank[];

  payments: PaymentSummary;
}