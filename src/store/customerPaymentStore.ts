import { create } from "zustand";

export interface CustomerPayment {
  id: number;
  date: string;
  customer: string;
  amount: number;
  method: "Cash" | "MoMo" | "Card";
  receivedBy: string;
}

interface CustomerPaymentStore {
  payments: CustomerPayment[];

  addPayment: (
    payment: Omit<CustomerPayment, "id" | "date">
  ) => void;

  totalCashToday: () => number;

  totalMoMoToday: () => number;

  totalCardToday: () => number;

  resetPayments: () => void;
}

export const useCustomerPaymentStore =
  create<CustomerPaymentStore>((set, get) => ({

    payments: [],

    addPayment: (payment) =>
      set((state) => ({
        payments: [
          ...state.payments,
          {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...payment,
          },
        ],
      })),

    totalCashToday: () =>
      get()
        .payments
        .filter((p) => p.method === "Cash")
        .reduce((sum, p) => sum + p.amount, 0),

    totalMoMoToday: () =>
      get()
        .payments
        .filter((p) => p.method === "MoMo")
        .reduce((sum, p) => sum + p.amount, 0),

    totalCardToday: () =>
      get()
        .payments
        .filter((p) => p.method === "Card")
        .reduce((sum, p) => sum + p.amount, 0),

    resetPayments: () =>
      set({
        payments: [],
      }),

  }));