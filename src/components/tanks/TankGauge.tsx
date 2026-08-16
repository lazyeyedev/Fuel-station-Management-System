interface TankGaugeProps {
  percentage: number;
  fuel: "Super" | "Diesel";
}

export default function TankGauge({
  percentage,
  fuel,
}: TankGaugeProps) {
  const level = Math.max(0, Math.min(100, percentage));

  return (
    <div className="flex flex-col items-center">

      <div
        className="relative h-72 w-28 overflow-hidden rounded-b-3xl rounded-t-xl border-4 border-gray-500 bg-[#0E1116]"
      >
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-700 ${
            fuel === "Super"
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
          style={{
            height: `${level}%`,
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">

          <span className="text-xl font-bold text-white drop-shadow-lg">
            {level.toFixed(0)}%
          </span>

        </div>

      </div>

      <p className="mt-4 font-semibold text-white">
        {fuel}
      </p>

    </div>
  );
}   