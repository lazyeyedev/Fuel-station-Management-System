import { create } from "zustand";

export interface CashExpense {
  id: number;
  time: string;
  description: string;
  amount: number;
  paidFrom: string;
  category: string;
  approvedBy: string;
  notes: string;
}

interface ExpenseStore {
  expenses: CashExpense[];

  addExpense: (expense: Omit<CashExpense, "id">) => void;

  removeExpense: (id: number) => void;

  totalExpenses: () => number;

  expensesByAttendant: (name: string) => number;

  resetExpenses: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({

  expenses: [],

  addExpense: (expense) =>
    set((state) => ({
      expenses: [
        ...state.expenses,
        {
          id: Date.now(),
          ...expense,
        },
      ],
    })),

  removeExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter(
        (e) => e.id !== id
      ),
    })),

  totalExpenses: () =>
    get().expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    ),

  expensesByAttendant: (name) =>
    get()
      .expenses
      .filter((e) => e.paidFrom === name)
      .reduce((sum, e) => sum + e.amount, 0),

  resetExpenses: () =>
    set({
      expenses: [],
    }),

}));