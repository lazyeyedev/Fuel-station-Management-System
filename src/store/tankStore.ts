import { create } from "zustand";

export interface Tank {
  id: string;
  fuelType: string;
  capacityLitres: number;
  currentLitres: number;
}

interface TankStore {
  tanks: Tank[];

  updateTank: (
    id: string,
    currentLitres: number
  ) => void;
}

export const useTankStore = create<TankStore>((set) => ({
  tanks: [
    {
      id: "tank-super",
      fuelType: "Super Tank",
      capacityLitres: 45000,
      currentLitres: 32000,
    },
    {
      id: "tank-diesel1",
      fuelType: "Diesel Tank 1",
      capacityLitres: 45000,
      currentLitres: 21000,
    },
    {
      id: "tank-diesel2",
      fuelType: "Diesel Tank 2",
      capacityLitres: 36000,
      currentLitres: 14000,
    },
  ],

  updateTank: (id, currentLitres) =>
    set((state) => ({
      tanks: state.tanks.map((tank) =>
        tank.id === id
          ? {
              ...tank,
              currentLitres,
            }
          : tank
      ),
    })),
}));