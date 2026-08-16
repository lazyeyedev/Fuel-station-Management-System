import { create } from "zustand";

export interface MeterReading {
  nozzle: string;
  attendant: string;
  opening: number;
  closing: number;
  litres: number;
  amount: number;
}

export interface DailyRecord {
  totalLitres: number;
  totalSales: number;
  superLitres: number;
  dieselLitres: number;

  meterReadings: MeterReading[];
}

interface DailyStore {
  daily: DailyRecord;

  setDaily: (data: DailyRecord) => void;

  getOpeningReading: (nozzle: string) => number;

  getAttendantSales: (name: string) => number;

  resetDaily: () => void;
}

export const useDailyStore = create<DailyStore>((set, get) => ({

  daily: {
    totalLitres: 0,
    totalSales: 0,
    superLitres: 0,
    dieselLitres: 0,
    meterReadings: [],
  },

  setDaily: (data) =>
    set({
      daily: data,
    }),

  getOpeningReading: (nozzle) => {
    const reading = get().daily.meterReadings.find(
      (r) => r.nozzle === nozzle
    );

    return reading?.closing ?? 0;
  },

  getAttendantSales: (name) => {

    return get()
      .daily
      .meterReadings
      .filter((r) => r.attendant === name)
      .reduce((sum, r) => sum + r.amount, 0);

  },

  resetDaily: () =>
    set({
      daily: {
        totalLitres: 0,
        totalSales: 0,
        superLitres: 0,
        dieselLitres: 0,
        meterReadings: [],
      },
    }),

}));