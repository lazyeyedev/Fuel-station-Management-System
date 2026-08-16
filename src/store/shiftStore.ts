import { create } from "zustand";

export type ShiftStatus =
  | "Draft"
  | "Reviewed"
  | "Closed";

interface ShiftStore {
  status: ShiftStatus;

  setDraft: () => void;

  setReviewed: () => void;

  closeShift: () => void;

  resetShift: () => void;

  canEdit: () => boolean;
}

export const useShiftStore = create<ShiftStore>((set, get) => ({

  status: "Draft",

  setDraft: () =>
    set({
      status: "Draft",
    }),

  setReviewed: () =>
    set({
      status: "Reviewed",
    }),

  closeShift: () =>
    set({
      status: "Closed",
    }),

  resetShift: () =>
    set({
      status: "Draft",
    }),

  canEdit: () =>
    get().status !== "Closed",

}));