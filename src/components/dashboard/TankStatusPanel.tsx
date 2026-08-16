import GlassPanel from "./GlassPanel";
import type { TankStatus } from "../../data/dashboardMockData";

interface TankStatusPanelProps {
  tanks: TankStatus[];
}

function getBarColor(
  currentLitres: number,
  capacityLitres: number
) {
  // 45,000 L tanks
  if (capacityLitres === 45000) {
    if (currentLitres <= 22500) {
      return "bg-red-500";
    }

    if (currentLitres <= 36000) {
      return "bg-yellow-400";
    }

    return "bg-green-500";
  }

  // 36,000 L tank
  if (capacityLitres === 36000) {
    if (currentLitres <= 18000) {
      return "bg-red-500";
    }

    if (currentLitres <= 27000) {
      return "bg-yellow-400";
    }

    return "bg-green-500";
  }

  return "bg-green-500";
}

function getStatus(
  currentLitres: number,
  capacityLitres: number
) {
  if (capacityLitres === 45000) {
    if (currentLitres <= 22500) return "LOW";
    if (currentLitres <= 36000) return "WARNING";
    return "NORMAL";
  }

  if (capacityLitres === 36000) {
    if (currentLitres <= 18000) return "LOW";
    if (currentLitres <= 27000) return "WARNING";
    return "NORMAL";
  }

  return "NORMAL";
}

function getStatusColor(status: string) {
  switch (status) {
    case "LOW":
      return "text-red-500";

    case "WARNING":
      return "text-yellow-400";

    default:
      return "text-green-500";
  }
}

export default function TankStatusPanel({
  tanks,
}: TankStatusPanelProps) {
  return (
    <GlassPanel className="p-5">

      <h3 className="text-sm font-semibold text-text-primary">
        Tank Status
      </h3>

      <div className="mt-5 flex flex-col gap-6">

        {tanks.map((tank) => {

          const percentage = Math.round(
            (tank.currentLitres / tank.capacityLitres) * 100
          );

          const status = getStatus(
            tank.currentLitres,
            tank.capacityLitres
          );

          return (

            <div key={tank.id}>

              <div className="flex items-center justify-between">

                <div>

                  <p className="font-semibold text-text-primary">
                    {tank.fuelType}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {tank.currentLitres.toLocaleString()} /{" "}
                    {tank.capacityLitres.toLocaleString()} L
                  </p>

                </div>

                <span
                  className={`text-xs font-bold ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>

              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-bg">

                <div
                  className={`h-full rounded-full ${getBarColor(
                    tank.currentLitres,
                    tank.capacityLitres
                  )}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-xs text-text-secondary">
                {percentage}% Full
              </p>

            </div>

          );
        })}

      </div>

    </GlassPanel>
  );
}