import { create } from "zustand";

export interface ShiftHandover {
  nozzleOpenings: Record<string, number>;
  tankOpenings: Record<string, number>;
}

interface HandoverStore {
  handover: ShiftHandover;

  saveNozzleOpenings: (
    data: Record<string, number>
  ) => void;

  saveTankOpenings: (
    data: Record<string, number>
  ) => void;

  getNozzleOpening: (
    nozzle: string
  ) => number;

  getTankOpening: (
    tank: string
  ) => number;

  reset: () => void;
}

export const useHandoverStore =
  create<HandoverStore>((set, get) => ({

    handover: {
      nozzleOpenings: {},
      tankOpenings: {},
    },

    saveNozzleOpenings: (data) =>
      set((state) => ({
        handover: {
          ...state.handover,
          nozzleOpenings: data,
        },
      })),

    saveTankOpenings: (data) =>
      set((state) => ({
        handover: {
          ...state.handover,
          tankOpenings: data,
        },
      })),

    getNozzleOpening: (nozzle) =>
      get().handover.nozzleOpenings[nozzle] ?? 0,

    getTankOpening: (tank) =>
      get().handover.tankOpenings[tank] ?? 0,

    reset: () =>
      set({
        handover: {
          nozzleOpenings: {},
          tankOpenings: {},
        },
      }),

  }));