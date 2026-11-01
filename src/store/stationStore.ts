import { create } from "zustand";

import {
  getAttendants,
  createAttendant as apiCreateAttendant,
  deactivateAttendant as apiDeactivateAttendant,
  type Attendant as ApiAttendant,
} from "../api";

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

  loading: boolean;
  saving: boolean;
  error: string;

  loadAttendants: (stationId?: number) => Promise<void>;

  addAttendant: (name: string, phone: string) => Promise<void>;

  removeAttendant: (id: number) => Promise<void>;

  saveAssignments: (data: NozzleAssignment[]) => void;
}

function mapAttendant(a: ApiAttendant): Attendant {
  return {
    id: a.id,
    name: a.full_name,
    phone: a.phone || "",
    active: a.active,
  };
}

export const useStationStore = create<StationStore>((set) => ({

  attendants: [],

  assignments: [],

  loading: false,
  saving: false,
  error: "",

  loadAttendants: async (stationId = 1) => {
    set({ loading: true, error: "" });

    try {
      const data = await getAttendants(stationId);

      set({
        attendants: data.map(mapAttendant),
        loading: false,
      });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to load attendants",
        loading: false,
      });
    }
  },

  addAttendant: async (name, phone) => {
    set({ saving: true, error: "" });

    try {
      const created = await apiCreateAttendant({
        stationId: 1,
        fullName: name,
        phone: phone || null,
      });

      set((state) => ({
        attendants: [
          ...state.attendants,
          mapAttendant(created),
        ],
        saving: false,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to add attendant",
        saving: false,
      });

      throw err;
    }
  },

  removeAttendant: async (id) => {
    set({ saving: true, error: "" });

    try {
      await apiDeactivateAttendant(id);

      set((state) => ({
        attendants: state.attendants.map((a) =>
          a.id === id ? { ...a, active: false } : a
        ),
        saving: false,
      }));
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to remove attendant",
        saving: false,
      });

      throw err;
    }
  },

  saveAssignments: (data) =>
    set({
      assignments: data,
    }),

}));
