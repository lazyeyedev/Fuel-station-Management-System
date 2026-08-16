import { create } from "zustand";

export interface CustomerAccount {
  id: number;
  date: string;
  customer: string;
  phone: string;
  fuel: "Super" | "Diesel";
  litres: number;
  amount: number;
  paid: number;
  approvedBy: string;
}

interface CustomerAccountStore {
  accounts: CustomerAccount[];

  addAccount: (
    account: Omit<
      CustomerAccount,
      "id" | "paid" | "date"
    >
  ) => void;

  receivePayment: (
    id: number,
    amount: number
  ) => void;

  removeAccount: (id: number) => void;

  totalOutstanding: () => number;

  totalCreditIssued: () => number;

  resetAccounts: () => void;
}

export const useCustomerAccountStore =
  create<CustomerAccountStore>(
    (set, get) => ({

      accounts: [],

      addAccount: (account) =>
        set((state) => ({
          accounts: [
            ...state.accounts,
            {
              id: Date.now(),
              date: new Date().toLocaleDateString(),
              paid: 0,
              ...account,
            },
          ],
        })),

      receivePayment: (id, amount) =>
        set((state) => ({
          accounts: state.accounts.map(
            (a) =>
              a.id === id
                ? {
                    ...a,
                    paid: Math.min(
                      a.amount,
                      a.paid + amount
                    ),
                  }
                : a
          ),
        })),

      removeAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter(
            (a) => a.id !== id
          ),
        })),

      totalOutstanding: () =>
        get().accounts.reduce(
          (sum, a) =>
            sum + (a.amount - a.paid),
          0
        ),

      totalCreditIssued: () =>
        get().accounts.reduce(
          (sum, a) => sum + a.amount,
          0
        ),

      resetAccounts: () =>
        set({
          accounts: [],
        }),

    })
  );