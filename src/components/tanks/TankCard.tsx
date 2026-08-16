import { useMemo } from "react";
import TankGauge from "./TankGauge";

interface TankCardProps {
  title: string;
  fuel: "Super" | "Diesel";

  opening: number;
  receipts: number;
  sales: number;
  dip: number;

  onOpeningChange: (value: number) => void;
  onReceiptsChange: (value: number) => void;
  onDipChange: (value: number) => void;

  capacity: number;
}

export default function TankCard({
  title,
  fuel,
  opening,
  receipts,
  sales,
  dip,
  onOpeningChange,
  onReceiptsChange,
  onDipChange,
  capacity,
}: TankCardProps) {
  const total = useMemo(() => opening + receipts, [opening, receipts]);

  const closing = useMemo(
    () => total - sales,
    [total, sales]
  );

  const difference = useMemo(
    () => dip - closing,
    [dip, closing]
  );

  const percentage = useMemo(() => {
    if (capacity <= 0) return 0;
    return (closing / capacity) * 100;
  }, [closing, capacity]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#171C22] p-6">

      <div className="grid grid-cols-[220px_1fr] gap-8">

        <TankGauge
          percentage={percentage}
          fuel={fuel}
        />

        <div>

          <h2 className="mb-6 text-2xl font-bold text-white">
            {title}
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Opening Stock
              </label>

              <input
                type="number"
                value={opening}
                onChange={(e) =>
                  onOpeningChange(Number(e.target.value))
                }
                className="w-full rounded-xl border border-gray-700 bg-[#0E1116] p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Receipts
              </label>

              <input
                type="number"
                value={receipts}
                onChange={(e) =>
                  onReceiptsChange(Number(e.target.value))
                }
                className="w-full rounded-xl border border-gray-700 bg-[#0E1116] p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Sales
              </label>

              <input
                value={sales.toFixed(2)}
                readOnly
                className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-green-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Closing Stock
              </label>

              <input
                value={closing.toFixed(2)}
                readOnly
                className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Dip Stock
              </label>

              <input
                type="number"
                value={dip}
                onChange={(e) =>
                  onDipChange(Number(e.target.value))
                }
                className="w-full rounded-xl border border-gray-700 bg-[#0E1116] p-3 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Difference
              </label>

              <input
                value={difference.toFixed(2)}
                readOnly
                className={`w-full rounded-xl border border-gray-700 p-3 ${
                  Math.abs(difference) < 1
                    ? "bg-gray-900 text-green-400"
                    : "bg-red-900 text-red-300"
                }`}
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}