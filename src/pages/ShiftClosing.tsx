import { useState } from "react";

import { useDailyStore } from "../store/dailyStore";
import { useExpenseStore } from "../store/expenseStore";
import { useCustomerPaymentStore } from "../store/customerPaymentStore";
import { useShiftStore } from "../store/shiftStore";
import { useHandoverStore } from "../store/handoverStore";

export default function ShiftClosing() {
  const daily = useDailyStore((s) => s.daily);

  const expenses = useExpenseStore((s) => s.expenses);

  const cashFromCredit =
    useCustomerPaymentStore((s) => s.totalCashToday);

  const closeShift =
    useShiftStore((s) => s.closeShift);

    const saveNozzleOpenings =
  useHandoverStore(
    (s) => s.saveNozzleOpenings
  );

  const status =
    useShiftStore((s) => s.status);

  const [cashCounted, setCashCounted] =
    useState("");

  const money = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const cashExpenses = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const expectedCash =
    daily.totalSales +
    cashFromCredit() -
    cashExpenses;

  const counted =
    Number(cashCounted || 0);

  const variance =
    counted - expectedCash;

  function finishShift() {
    if (status === "Closed") {
      alert("Shift is already closed.");
      return;
    }

    if (!cashCounted) {
      alert("Enter cash counted.");
      return;
    }

    const confirmed = window.confirm(
      "Close this shift? It will become read-only."
    );

    if (!confirmed) return;

    const openings: Record<string, number> = {};

daily.meterReadings.forEach((reading) => {
  openings[reading.nozzle] = reading.closing;
});

saveNozzleOpenings(openings);

    closeShift();

    alert("Shift closed successfully.");
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-white">
          Shift Closing
        </h1>

        <p className="text-gray-400">
          Final reconciliation before closing.
        </p>

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6 space-y-5">

        <Row
          label="Today's Fuel Sales"
          value={daily.totalSales}
        />

        <Row
          label="Credit Payments Received Today"
          value={cashFromCredit()}
        />

        <Row
          label="Cash Expenses"
          value={cashExpenses}
        />

        <hr className="border-gray-700" />

        <Row
          label="Expected Cash"
          value={expectedCash}
          large
        />

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <label className="mb-3 block text-gray-400">
          Cash Counted
        </label>

        <input
          type="number"
          value={cashCounted}
          disabled={status === "Closed"}
          onChange={(e) =>
            setCashCounted(e.target.value)
          }
          className="w-full rounded-xl bg-[#0E1116] p-4 text-xl text-white"
        />

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <Row
          label="Difference"
          value={variance}
          large
          green={variance === 0}
          red={variance < 0}
          yellow={variance > 0}
        />

      </div>

      <button
        onClick={finishShift}
        disabled={status === "Closed"}
        className={`rounded-xl px-8 py-4 font-bold text-white ${
          status === "Closed"
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {status === "Closed"
          ? "Shift Closed"
          : "Close Shift"}
      </button>

    </div>
  );
}

interface RowProps {
  label: string;
  value: number;
  large?: boolean;
  green?: boolean;
  red?: boolean;
  yellow?: boolean;
}

function Row({
  label,
  value,
  large,
  green,
  red,
  yellow,
}: RowProps) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-gray-400">
        {label}
      </span>

      <span
        className={`font-bold ${
          large ? "text-2xl" : ""
        } ${
          green
            ? "text-green-400"
            : red
            ? "text-red-500"
            : yellow
            ? "text-yellow-400"
            : "text-white"
        }`}
      >
        GH₵{" "}
        {value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>

    </div>
  );
}