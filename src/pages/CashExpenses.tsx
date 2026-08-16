import { useState } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useStationStore } from "../store/stationStore";

export default function CashExpenses() {
  const attendants = useStationStore((s) => s.attendants);

  const expenses = useExpenseStore((s) => s.expenses);
  const addExpense = useExpenseStore((s) => s.addExpense);
  const totalExpenses = useExpenseStore((s) => s.totalExpenses);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidFrom, setPaidFrom] = useState("Office Cash");
  const [category, setCategory] = useState("Refreshments");
  const [notes, setNotes] = useState("");

  function saveExpense() {
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    addExpense({
      time: new Date().toLocaleTimeString(),
      description,
      amount: Number(amount),
      paidFrom,
      category,
      approvedBy: "Manager",
      notes,
    });

    setDescription("");
    setAmount("");
    setPaidFrom("Office Cash");
    setCategory("Refreshments");
    setNotes("");

    alert("Expense saved successfully.");
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Cash Expenses
        </h1>

        <p className="text-gray-400">
          Record all cash paid out during the shift.
        </p>
      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="mb-2 block text-gray-400">
              Description
            </label>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Drinking Water"
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-400">
              Amount (GH₵)
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-400">
              Paid From
            </label>

            <select
              value={paidFrom}
              onChange={(e) => setPaidFrom(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Office Cash</option>

              {attendants.map((attendant) => (
                <option
                  key={attendant.id}
                  value={attendant.name}
                >
                  {attendant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-gray-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Refreshments</option>
              <option>Cleaning</option>
              <option>Station Supplies</option>
              <option>Repairs</option>
              <option>Transport</option>
              <option>Other</option>
            </select>
          </div>

        </div>

        <div className="mt-6">

          <label className="mb-2 block text-gray-400">
            Notes
          </label>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
          />

        </div>

      </div>

      <div className="flex justify-end">

        <button
          onClick={saveExpense}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500"
        >
          Save Expense
        </button>

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-xl font-bold text-white">
            Today's Expenses
          </h2>

          <h2 className="font-bold text-green-400">
            Total: GH₵ {totalExpenses().toFixed(2)}
          </h2>

        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-400">
            No expenses recorded.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-2 text-left">Time</th>
                <th className="text-left">Description</th>
                <th className="text-left">Paid From</th>
                <th className="text-left">Category</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-gray-800"
                >
                  <td className="py-3">{expense.time}</td>
                  <td>{expense.description}</td>
                  <td>{expense.paidFrom}</td>
                  <td>{expense.category}</td>
                  <td className="text-right font-bold text-yellow-400">
                    GH₵ {expense.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}