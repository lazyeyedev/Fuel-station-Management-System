import { useState } from "react";

interface Props {
  customer: string;
  outstanding: number;
  onReceive: (
    amount: number,
    method: "Cash" | "MoMo" | "Card"
  ) => void;
  onClose: () => void;
}

const money = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ReceivePaymentModal({
  customer,
  outstanding,
  onReceive,
  onClose,
}: Props) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<
    "Cash" | "MoMo" | "Card"
  >("Cash");

  function submit() {
    const value = Number(amount);

    if (value <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    if (value > outstanding) {
      alert("Amount exceeds outstanding balance.");
      return;
    }

    onReceive(value, method);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-md rounded-2xl bg-[#171C22] p-6">

        <h2 className="text-2xl font-bold text-white">
          Receive Payment
        </h2>

        <div className="mt-6 space-y-4">

          <div>
            <p className="text-gray-400">
              Customer
            </p>

            <p className="font-bold text-white">
              {customer}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              Outstanding Balance
            </p>

            <p className="font-bold text-yellow-400">
              GH₵ {money(outstanding)}
            </p>
          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Amount Received
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-gray-400">
              Payment Method
            </label>

            <select
              value={method}
              onChange={(e) =>
                setMethod(
                  e.target.value as
                    | "Cash"
                    | "MoMo"
                    | "Card"
                )
              }
              className="w-full rounded-xl bg-[#0E1116] p-3 text-white"
            >
              <option>Cash</option>
              <option>MoMo</option>
              <option>Card</option>
            </select>

          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-6 py-3 text-white"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500"
          >
            Receive Payment
          </button>

        </div>

      </div>

    </div>
  );
}