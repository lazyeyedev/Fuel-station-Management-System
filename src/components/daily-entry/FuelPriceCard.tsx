interface FuelPriceCardProps {
  superPrice: string;
  dieselPrice: string;
  setSuperPrice: (value: string) => void;
  setDieselPrice: (value: string) => void;
  canEdit: boolean;
}

export default function FuelPriceCard({
  superPrice,
  dieselPrice,
  setSuperPrice,
  setDieselPrice,
  canEdit,
}: FuelPriceCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#171C22] p-6 shadow-lg">

      <h2 className="mb-6 text-xl font-bold text-white">
        Fuel Prices
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>

          <label className="mb-2 block text-sm text-gray-400">
            Super (GH₵ / Litre)
          </label>

          <input
            type="number"
            value={superPrice}
            onChange={(e) => setSuperPrice(e.target.value)}
            placeholder="0.00"
            disabled={!canEdit}
            className={`w-full rounded-xl border px-4 py-3 outline-none ${
              canEdit
                ? "border-gray-700 bg-[#0E1116] text-white focus:border-green-500"
                : "cursor-not-allowed border-gray-800 bg-gray-700 text-gray-400"
            }`}
          />

        </div>

        <div>

          <label className="mb-2 block text-sm text-gray-400">
            Diesel (GH₵ / Litre)
          </label>

          <input
            type="number"
            value={dieselPrice}
            onChange={(e) => setDieselPrice(e.target.value)}
            placeholder="0.00"
            disabled={!canEdit}
            className={`w-full rounded-xl border px-4 py-3 outline-none ${
              canEdit
                ? "border-gray-700 bg-[#0E1116] text-white focus:border-green-500"
                : "cursor-not-allowed border-gray-800 bg-gray-700 text-gray-400"
            }`}
          />

        </div>

      </div>

    </div>
  );
}