import { useEffect, useState } from "react";

import { useDailyStore } from "../store/dailyStore";
import { useStationStore } from "../store/stationStore";
import { useShiftStore } from "../store/shiftStore";
import { useHandoverStore } from "../store/handoverStore";

import FuelPriceCard from "../components/daily-entry/FuelPriceCard";
import PumpReadingTable from "../components/daily-entry/PumpReadingTable";
import DailyTotals from "../components/daily-entry/DailyTotals";
import SaveDayButton from "../components/daily-entry/SaveDayButton";

export default function DailyEntry() {
  const setDaily = useDailyStore((s) => s.setDaily);
  const getNozzleOpening = useHandoverStore(
  (s) => s.getNozzleOpening
);
  const getOpeningReading = useDailyStore((s) => s.getOpeningReading);
  

  const canEdit = useShiftStore((s) => s.canEdit());

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [shift, setShift] = useState("Morning");

  const [superPrice, setSuperPrice] = useState("");
  const [dieselPrice, setDieselPrice] = useState("");

  const [nozzles, setNozzles] = useState([
    { name: "Pump 1 - Super", fuel: "Super" as const, opening: "", closing: "" },
    { name: "Pump 1 - Diesel", fuel: "Diesel" as const, opening: "", closing: "" },
    { name: "Pump 2 - Diesel", fuel: "Diesel" as const, opening: "", closing: "" },
    { name: "Pump 3 - Super 1", fuel: "Super" as const, opening: "", closing: "" },
    { name: "Pump 3 - Super 2", fuel: "Super" as const, opening: "", closing: "" },
    { name: "Pump 3 - Diesel 1", fuel: "Diesel" as const, opening: "", closing: "" },
    { name: "Pump 3 - Diesel 2", fuel: "Diesel" as const, opening: "", closing: "" },
    { name: "Pump 3 - Diesel 3", fuel: "Diesel" as const, opening: "", closing: "" },
    { name: "Pump 3 - Diesel 4", fuel: "Diesel" as const, opening: "", closing: "" },
    { name: "Pump 4 - Super", fuel: "Super" as const, opening: "", closing: "" },
    { name: "Pump 4 - Diesel", fuel: "Diesel" as const, opening: "", closing: "" },
  ]);

  useEffect(() => {
  setNozzles((current) =>
    current.map((n) => {
      const handoverOpening =
        getNozzleOpening(n.name);

      return {
        ...n,
        opening: String(
          handoverOpening ||
          getOpeningReading(n.name) ||
          ""
        ),
      };
    })
  );
}, [getOpeningReading, getNozzleOpening]);

  function handleSave() {
    if (!canEdit) {
      alert("This shift has been closed and can no longer be edited.");
      return;
    }

    if (!superPrice.trim()) {
      alert("Please enter the Super fuel price.");
      return;
    }

    if (!dieselPrice.trim()) {
      alert("Please enter the Diesel fuel price.");
      return;
    }

    const assignments = useStationStore.getState().assignments;

    const unassigned = nozzles.find(
      (n) =>
        !assignments.find(
          (a) => a.nozzle === n.name && a.attendant
        )
    );

    if (unassigned) {
      alert(`${unassigned.name} has no attendant assigned.`);
      return;
    }

    const missingReading = nozzles.find(
      (n) => !n.closing.trim()
    );

    if (missingReading) {
      alert(`${missingReading.name} has no closing reading.`);
      return;
    }

    let superLitres = 0;
    let dieselLitres = 0;

    const meterReadings = nozzles.map((n) => {
      const opening = Number(n.opening || 0);
      const closing = Number(n.closing || 0);

      const litres = Math.max(0, closing - opening);

      if (n.fuel === "Super") {
        superLitres += litres;
      } else {
        dieselLitres += litres;
      }

      const price =
        n.fuel === "Super"
          ? Number(superPrice)
          : Number(dieselPrice);

      const assignment = assignments.find(
        (a) => a.nozzle === n.name
      );

      return {
        nozzle: n.name,
        attendant: assignment?.attendant || "",
        opening,
        closing,
        litres,
        amount: litres * price,
      };
    });

    const totalLitres = superLitres + dieselLitres;

    const totalSales = meterReadings.reduce(
      (sum, r) => sum + r.amount,
      0
    );

    setDaily({
      superLitres,
      dieselLitres,
      totalLitres,
      totalSales,
      meterReadings,
    });

    alert("Daily Entry Saved Successfully");
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white">
            Daily Entry
          </h1>

          <p className="text-gray-400">
            {today}
          </p>

        </div>

        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          disabled={!canEdit}
          className={`rounded-xl border px-4 py-2 ${
            canEdit
              ? "border-gray-700 bg-[#171C22] text-white"
              : "cursor-not-allowed border-gray-800 bg-gray-700 text-gray-400"
          }`}
        >
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Night</option>
        </select>

      </div>

      <FuelPriceCard
        superPrice={superPrice}
        dieselPrice={dieselPrice}
        setSuperPrice={setSuperPrice}
        setDieselPrice={setDieselPrice}
        canEdit={canEdit}
      />

      <PumpReadingTable
        nozzles={nozzles}
        setNozzles={setNozzles}
        superPrice={superPrice}
        dieselPrice={dieselPrice}
        canEdit={canEdit}
      />

      <DailyTotals
        nozzles={nozzles}
        superPrice={superPrice}
        dieselPrice={dieselPrice}
      />

      <SaveDayButton
        onSave={handleSave}
        canEdit={canEdit}
      />

    </div>
  );
}