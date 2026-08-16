interface Props {
  expected: number;
  cashSubmitted: number;
  momo: number;
  card: number;
  coupon: number;
  credit: number;
  cashTaken: number;
}

const money = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PaymentTotals({
  expected,
  cashSubmitted,
  momo,
  card,
  coupon,
  credit,
  cashTaken,
}: Props) {
  const submitted =
    cashSubmitted +
    momo +
    card +
    coupon +
    credit;

  const variance =
    submitted +
    cashTaken -
    expected;

  return (
    <div className="rounded-2xl bg-[#171C22] p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Shift Totals
      </h2>

      <div className="space-y-4">

        <Row
          label="Expected Sales"
          value={expected}
        />

        <Row
          label="Cash Submitted"
          value={cashSubmitted}
        />

        <Row
          label="Mobile Money"
          value={momo}
        />

        <Row
          label="Card"
          value={card}
        />

        <Row
          label="Coupon"
          value={coupon}
        />

        <Row
          label="Credit"
          value={credit}
        />

        <Row
          label="Cash Expenses"
          value={cashTaken}
        />

        <hr className="border-gray-700" />

        <Row
          label="Total Submitted"
          value={submitted}
          large
        />

        <Row
          label="Variance"
          value={variance}
          large
          green={variance === 0}
          red={variance < 0}
          yellow={variance > 0}
        />

      </div>

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
    <div className="flex justify-between items-center">

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
        GH₵ {money(value)}
      </span>

    </div>
  );
}