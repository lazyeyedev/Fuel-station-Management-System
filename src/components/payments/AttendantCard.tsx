interface Props {
  attendant: string;

  expected: number;

  cashTaken: number;

  nozzles: {
    nozzle: string;
    amount: number;
  }[];

  cash: string;
  momo: string;
  card: string;
  coupon: string;
  credit: string;

  onChange: (
    field:
      | "cash"
      | "momo"
      | "card"
      | "coupon"
      | "credit",
    value: string
  ) => void;
}

const money = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function AttendantCard({
  attendant,
  expected,
  cashTaken,
  nozzles,
  cash,
  momo,
  card,
  coupon,
  credit,
  onChange,
}: Props) {
  const submitted =
    Number(cash || 0) +
    Number(momo || 0) +
    Number(card || 0) +
    Number(coupon || 0) +
    Number(credit || 0);

  const variance =
    submitted +
    cashTaken -
    expected;

  return (
    <div className="rounded-2xl bg-[#171C22] p-6 space-y-6">

      <div>

        <h2 className="text-2xl font-bold text-white">
          {attendant}
        </h2>

        <p className="text-yellow-400 font-semibold mt-2">
          Expected Sales: GH₵ {money(expected)}
        </p>

      </div>

      <div>

        <h3 className="font-semibold text-green-400 mb-3">
          Nozzle Breakdown
        </h3>

        {nozzles.map((n) => (
          <div
            key={n.nozzle}
            className="flex justify-between py-1"
          >
            <span>{n.nozzle}</span>

            <span className="font-bold">
              GH₵ {money(n.amount)}
            </span>
          </div>
        ))}

      </div>

      <div className="rounded-xl bg-[#0E1116] p-4">

        <div className="flex justify-between">

          <span>Cash Taken</span>

          <span className="font-bold text-orange-400">
            GH₵ {money(cashTaken)}
          </span>

        </div>

      </div>

      <div className="grid grid-cols-5 gap-3">

        {[
          ["Cash", cash],
          ["MoMo", momo],
          ["Card", card],
          ["Coupon", coupon],
          ["Credit", credit],
        ].map(([label, value]) => (

          <div key={label}>

            <label className="text-xs text-gray-400">
              {label}
            </label>

            <input
              type="number"
              value={value}
              onChange={(e) =>
                onChange(
                  label.toLowerCase() as
                    | "cash"
                    | "momo"
                    | "card"
                    | "coupon"
                    | "credit",
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-lg bg-[#0E1116] p-2 text-center text-white"
            />

          </div>

        ))}

      </div>

      <div className="border-t border-gray-700 pt-4 flex justify-between">

        <div>

          <p className="text-gray-400">
            Total Submitted
          </p>

          <h2 className="text-2xl font-bold text-green-400">
            GH₵ {money(submitted)}
          </h2>

        </div>

        <div className="text-right">

          <p className="text-gray-400">
            Variance
          </p>

          <h2
            className={`text-2xl font-bold ${
              variance === 0
                ? "text-green-400"
                : variance < 0
                ? "text-red-500"
                : "text-yellow-400"
            }`}
          >
            GH₵ {money(variance)}
          </h2>

        </div>

      </div>

    </div>
  );
}