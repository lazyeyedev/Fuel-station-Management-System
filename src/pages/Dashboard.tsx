import {
  Calendar,
  Clock,
  Users,
  Fuel,
  Banknote,
  Droplets,
} from "lucide-react";

import { useStationStore } from "../store/stationStore";
import { useDailyStore } from "../store/dailyStore";
import { useTankStore } from "../store/tankStore";

import StatCard from "../components/dashboard/StatCard";
import TankStatusPanel from "../components/dashboard/TankStatusPanel";

export default function Dashboard() {
  const attendants = useStationStore((s) => s.attendants);
  const daily = useDailyStore((s) => s.daily);

  // NEW: Live tanks from the shared store
  const tanks = useTankStore((s) => s.tanks);

  const today = new Date().toLocaleDateString();

  const money = (v: number) =>
    `GH₵ ${v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const litres = (v: number) =>
    `${v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#171C22] p-6">
        <h1 className="text-3xl font-bold text-white">
          Shell Forecourt Management System
        </h1>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <h3 className="text-white">{today}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Shift</p>
              <h3 className="text-white">Morning</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Attendants</p>
              <h3 className="text-white">{attendants.length}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Fuel className="text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Active Nozzles</p>
              <h3 className="text-white">11</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Banknote}
          data={{
            id: "sales",
            label: "Today's Sales",
            value: money(daily.totalSales),
            delta: "",
            trend: "up",
          }}
        />

        <StatCard
          icon={Droplets}
          data={{
            id: "litres",
            label: "Today's Litres",
            value: litres(daily.totalLitres),
            unit: "L",
            delta: "",
            trend: "up",
          }}
        />

        <StatCard
          icon={Fuel}
          data={{
            id: "super",
            label: "Super Sold",
            value: litres(daily.superLitres),
            unit: "L",
            delta: "",
            trend: "up",
          }}
        />

        <StatCard
          icon={Fuel}
          data={{
            id: "diesel",
            label: "Diesel Sold",
            value: litres(daily.dieselLitres),
            unit: "L",
            delta: "",
            trend: "up",
          }}
        />
      </div>

      {/* Live tank data */}
      <TankStatusPanel tanks={tanks} />
    </div>
  );
}