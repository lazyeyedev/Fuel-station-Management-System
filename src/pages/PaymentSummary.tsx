import { useMemo, useState } from "react";
import { useStationStore } from "../store/stationStore";
import { useDailyStore } from "../store/dailyStore";
import { useExpenseStore } from "../store/expenseStore";

import AttendantCard from "../components/payments/AttendantCard";
import PaymentTotals from "../components/payments/PaymentTotals";

type PaymentField = "cash" | "momo" | "card" | "coupon" | "credit";

type PaymentEntry = Record<PaymentField, string>;

const emptyEntry: PaymentEntry = {
  cash: "",
  momo: "",
  card: "",
  coupon: "",
  credit: "",
};

export default function PaymentSummary() {
  const attendants = useStationStore((s) => s.attendants);

  const meterReadings = useDailyStore(
    (s) => s.daily.meterReadings
  );

  const getAttendantSales = useDailyStore(
    (s) => s.getAttendantSales
  );

  const expensesByAttendant = useExpenseStore(
    (s) => s.expensesByAttendant
  );

  // Amounts typed by the user, keyed by attendant id. Kept separate from the
  // attendant list so rows appear as soon as attendants finish loading.
  const [entries, setEntries] = useState<
    Record<number, PaymentEntry>
  >({});

  const payments = useMemo(
    () =>
      attendants
        .filter((a) => a.active)
        .map((a) => ({
          id: a.id,
          name: a.name,
          ...(entries[a.id] ?? emptyEntry),
        })),
    [attendants, entries]
  );

  function update(
    id: number,
    field: PaymentField,
    value: string
  ) {
    setEntries((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? emptyEntry),
        [field]: value,
      },
    }));
  }

  const totals = useMemo(() => {
    let expected = 0;
    let cashSubmitted = 0;
    let momo = 0;
    let card = 0;
    let coupon = 0;
    let credit = 0;
    let cashTaken = 0;

    payments.forEach((row) => {
      expected += getAttendantSales(row.name);

      cashTaken += expensesByAttendant(
        row.name
      );

      cashSubmitted += Number(
        row.cash || 0
      );

      momo += Number(row.momo || 0);

      card += Number(row.card || 0);

      coupon += Number(
        row.coupon || 0
      );

      credit += Number(
        row.credit || 0
      );
    });

    return {
      expected,
      cashSubmitted,
      momo,
      card,
      coupon,
      credit,
      cashTaken,
    };
  }, [
    payments,
    getAttendantSales,
    expensesByAttendant,
  ]);

  function saveSummary() {
    alert(
      "Payment Summary Saved Successfully"
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Attendant Reconciliation
        </h1>

        <p className="text-gray-400">
          Reconcile each attendant's shift before closing.
        </p>
      </div>

      {payments.length === 0 && (
        <p className="text-gray-400">
          No active attendants. Add attendants first.
        </p>
      )}

      <div className="space-y-6">

        {payments.map((row) => {

          const nozzles = meterReadings
            .filter(
              (m) => m.attendant === row.name
            )
            .map((m) => ({
              nozzle: m.nozzle,
              amount: m.amount,
            }));

          return (
            <AttendantCard
              key={row.id}
              attendant={row.name}
              expected={getAttendantSales(
                row.name
              )}
              cashTaken={expensesByAttendant(
                row.name
              )}
              nozzles={nozzles}
              cash={row.cash}
              momo={row.momo}
              card={row.card}
              coupon={row.coupon}
              credit={row.credit}
              onChange={(field, value) =>
                update(
                  row.id,
                  field,
                  value
                )
              }
            />
          );

        })}

      </div>

      <PaymentTotals
        expected={totals.expected}
        cashSubmitted={totals.cashSubmitted}
        momo={totals.momo}
        card={totals.card}
        coupon={totals.coupon}
        credit={totals.credit}
        cashTaken={totals.cashTaken}
      />

      <div className="flex justify-end">

        <button
          onClick={saveSummary}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500"
        >
          Save Payment Summary
        </button>

      </div>

    </div>
  );
}
