import React from "react";
import { useStationStore } from "../../store/stationStore";
import type { NozzleAssignment } from "../../store/stationStore";

interface Nozzle {
  name: string;
  fuel: "Super" | "Diesel";
  opening: string;
  closing: string;
}

interface Props {
  nozzles: Nozzle[];
  setNozzles: React.Dispatch<React.SetStateAction<Nozzle[]>>;
  superPrice: string;
  dieselPrice: string;
  canEdit: boolean;
}

const pumps = [
  {
    title: "Pump 1",
    items: ["Pump 1 - Super", "Pump 1 - Diesel"],
  },
  {
    title: "Pump 2",
    items: ["Pump 2 - Diesel"],
  },
  {
    title: "Pump 3",
    items: [
      "Pump 3 - Super 1",
      "Pump 3 - Super 2",
      "Pump 3 - Diesel 1",
      "Pump 3 - Diesel 2",
      "Pump 3 - Diesel 3",
      "Pump 3 - Diesel 4",
    ],
  },
  {
    title: "Pump 4",
    items: ["Pump 4 - Super", "Pump 4 - Diesel"],
  },
];

const format = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PumpReadingTable({
  nozzles,
  setNozzles,
  superPrice,
  dieselPrice,
  canEdit,
}: Props) {
  const assignments = useStationStore(
    (state) => state.assignments
  );

  function attendantFor(nozzle: string) {
    const found = assignments.find(
      (a: NozzleAssignment) => a.nozzle === nozzle
    );

    return found?.attendant || "Not Assigned";
  }

  return (
    <div className="space-y-6">

      {pumps.map((pump) => (

        <div
          key={pump.title}
          className="rounded-2xl border border-white/10 bg-[#171C22] p-6"
        >

          <h2 className="mb-5 text-2xl font-bold text-green-400">
            {pump.title}
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b border-gray-700 text-gray-400">

                <th className="py-3 text-left">
                  Nozzle
                </th>

                <th className="text-left">
                  Attendant
                </th>

                <th>Opening</th>

                <th>Closing</th>

                <th>Litres</th>

                <th>Amount (GH₵)</th>

              </tr>

            </thead>

            <tbody>

              {pump.items.map((item) => {

                const index = nozzles.findIndex(
                  (n) => n.name === item
                );

                const nozzle = nozzles[index];

                const opening = Number(nozzle.opening || 0);

const hasClosing =
  nozzle.closing.trim() !== "";

const closing = Number(nozzle.closing || 0);

const litres = hasClosing
  ? closing - opening
  : 0;

const price =
  nozzle.fuel === "Super"
    ? Number(superPrice || 0)
    : Number(dieselPrice || 0);

const amount = litres * price;

                return (

                  <tr
                    key={nozzle.name}
                    className="border-b border-gray-800"
                  >

                    <td className="py-4 text-white">
                      {nozzle.name}
                    </td>

                    <td className="font-semibold text-cyan-400">
                      {attendantFor(nozzle.name)}
                    </td>

                    <td>

                      <input
                        type="number"
                        value={nozzle.opening}
                        disabled={!canEdit}
                        onChange={(e) => {
                          const copy = [...nozzles];
                          copy[index].opening = e.target.value;
                          setNozzles(copy);
                        }}
                        className={`w-28 rounded-lg p-2 ${
                          canEdit
                            ? "bg-[#0E1116] text-white"
                            : "cursor-not-allowed bg-gray-700 text-gray-400"
                        }`}
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        value={nozzle.closing}
                        disabled={!canEdit}
                        onChange={(e) => {
                          const copy = [...nozzles];
                          copy[index].closing = e.target.value;
                          setNozzles(copy);
                        }}
                        className={`w-28 rounded-lg p-2 ${
                          canEdit
                            ? "bg-[#0E1116] text-white"
                            : "cursor-not-allowed bg-gray-700 text-gray-400"
                        }`}
                      />

                    </td>

                    <td
  className={`font-bold ${
    !hasClosing
      ? "text-gray-500"
      : litres < 0
      ? "text-red-500"
      : "text-green-400"
  }`}
>
  {!hasClosing
    ? "—"
    : litres < 0
    ? "Invalid"
    : format(litres)}
</td>

<td className="font-bold text-yellow-400">
  {!hasClosing
    ? "—"
    : litres < 0
    ? "-"
    : format(amount)}
</td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      ))}

    </div>
  );
}