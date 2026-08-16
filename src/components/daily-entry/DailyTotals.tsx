interface Nozzle {
  fuel: "Super" | "Diesel";
  opening: string;
  closing: string;
}

interface Props {
  nozzles: Nozzle[];
  superPrice: string;
  dieselPrice: string;
}

const format = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function DailyTotals({
  nozzles,
  superPrice,
  dieselPrice,
}: Props) {
  let superLitres = 0;
  let dieselLitres = 0;

  nozzles.forEach((n) => {
    const litres =
      Number(n.closing || 0) -
      Number(n.opening || 0);

    if (litres <= 0) return;

    if (n.fuel === "Super") {
      superLitres += litres;
    } else {
      dieselLitres += litres;
    }
  });

  const totalLitres = superLitres + dieselLitres;

  const superSales =
    superLitres * Number(superPrice || 0);

  const dieselSales =
    dieselLitres * Number(dieselPrice || 0);

  const totalSales =
    superSales + dieselSales;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">

      <div className="rounded-xl bg-[#171C22] border border-white/10 p-5">
        <p className="text-sm text-gray-400">
          Super Sold
        </p>

        <h2 className="mt-2 text-2xl font-bold text-green-400">
          {format(superLitres)} L
        </h2>
      </div>

      <div className="rounded-xl bg-[#171C22] border border-white/10 p-5">
        <p className="text-sm text-gray-400">
          Diesel Sold
        </p>

        <h2 className="mt-2 text-2xl font-bold text-blue-400">
          {format(dieselLitres)} L
        </h2>
      </div>

      <div className="rounded-xl bg-[#171C22] border border-white/10 p-5">
        <p className="text-sm text-gray-400">
          Total Litres
        </p>

        <h2 className="mt-2 text-2xl font-bold text-cyan-400">
          {format(totalLitres)} L
        </h2>
      </div>

      <div className="rounded-xl bg-[#171C22] border border-white/10 p-5">
        <p className="text-sm text-gray-400">
          Super Sales
        </p>

        <h2 className="mt-2 text-2xl font-bold text-yellow-400">
          GH₵ {format(superSales)}
        </h2>
      </div>

      <div className="rounded-xl bg-[#171C22] border border-white/10 p-5">
        <p className="text-sm text-gray-400">
          Diesel Sales
        </p>

        <h2 className="mt-2 text-2xl font-bold text-yellow-400">
          GH₵ {format(dieselSales)}
        </h2>
      </div>

      <div className="rounded-xl bg-green-700 p-5">
        <p className="text-sm text-green-100">
          Total Fuel Sales
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          GH₵ {format(totalSales)}
        </h2>
      </div>

    </div>
  );
}