import { create } from "zustand";

export interface Attendant {
  id: number;
  name: string;
  phone: string;
  active: boolean;
}

export interface NozzleAssignment {
  nozzle: string;
  attendant: string;
}

interface StationStore {
  attendants: Attendant[];

  assignments: NozzleAssignment[];

  addAttendant: (name: string, phone: string) => void;

  removeAttendant: (id: number) => void;

  saveAssignments: (data: NozzleAssignment[]) => void;
}

export const useStationStore = create<StationStore>((set) => ({

  attendants: [
    { id: 1, name: "Joseph", phone: "", active: true },
    { id: 2, name: "Zainabu", phone: "", active: true },
    { id: 3, name: "Comfort", phone: "", active: true },
    { id: 4, name: "Noah", phone: "", active: true },
    { id: 5, name: "Francis", phone: "", active: true },
    { id: 6, name: "Owusu", phone: "", active: true },
    { id: 7, name: "Jesus Lina", phone: "", active: true },
  ],

  assignments: [],

  addAttendant: (name, phone) =>
    set((state) => ({
      attendants: [
        ...state.attendants,
        {
          id: Date.now(),
          name,
          phone,
          active: true,
        },
      ],
    })),

  removeAttendant: (id) =>
    set((state) => ({
      attendants: state.attendants.filter(
        (a) => a.id !== id
      ),
    })),

  saveAssignments: (data) =>
    set({
      assignments: data,
    }),

}));