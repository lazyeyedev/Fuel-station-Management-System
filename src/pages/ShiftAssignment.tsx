import { useState } from "react";
import { useStationStore } from "../store/stationStore";
import type { NozzleAssignment } from "../store/stationStore";

interface Assignment {
  nozzle: string;
  fuel: "Super" | "Diesel";
  attendant: string;
}

const initialAssignments: Assignment[] = [
  { nozzle: "Pump 1 - Super", fuel: "Super", attendant: "" },
  { nozzle: "Pump 1 - Diesel", fuel: "Diesel", attendant: "" },
  { nozzle: "Pump 2 - Diesel", fuel: "Diesel", attendant: "" },
  { nozzle: "Pump 3 - Super 1", fuel: "Super", attendant: "" },
  { nozzle: "Pump 3 - Super 2", fuel: "Super", attendant: "" },
  { nozzle: "Pump 3 - Diesel 1", fuel: "Diesel", attendant: "" },
  { nozzle: "Pump 3 - Diesel 2", fuel: "Diesel", attendant: "" },
  { nozzle: "Pump 3 - Diesel 3", fuel: "Diesel", attendant: "" },
  { nozzle: "Pump 3 - Diesel 4", fuel: "Diesel", attendant: "" },
  { nozzle: "Pump 4 - Super", fuel: "Super", attendant: "" },
  { nozzle: "Pump 4 - Diesel", fuel: "Diesel", attendant: "" },
];

export default function ShiftAssignment() {
  const attendants = useStationStore((s) => s.attendants);
  const saveAssignments = useStationStore((s) => s.saveAssignments);

  const [date] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [shift, setShift] = useState("Morning");
  const [manager, setManager] = useState("");

  const [assignments, setAssignments] =
    useState(initialAssignments);

  function update(index: number, value: string) {
    const copy = [...assignments];
    copy[index].attendant = value;
    setAssignments(copy);
  }

  function handleSave() {
    const data: NozzleAssignment[] = assignments.map((a) => ({
      nozzle: a.nozzle,
      attendant: a.attendant,
    }));

    saveAssignments(data);

    alert("Shift Assignment Saved");
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-white">
          Shift Assignment
        </h1>

        <p className="text-gray-400">
          Assign attendants to nozzles.
        </p>

      </div>

      <div className="grid grid-cols-3 gap-4 rounded-2xl bg-[#171C22] p-6">

        <input
          type="date"
          value={date}
          readOnly
          className="rounded-xl bg-[#0E1116] p-3 text-white"
        />

        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="rounded-xl bg-[#0E1116] p-3 text-white"
        >
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Night</option>
        </select>

        <input
          value={manager}
          onChange={(e) => setManager(e.target.value)}
          placeholder="Manager"
          className="rounded-xl bg-[#0E1116] p-3 text-white"
        />

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-700 text-gray-400">

              <th className="py-3 text-left">
                Nozzle
              </th>

              <th className="text-left">
                Fuel
              </th>

              <th className="text-left">
                Attendant
              </th>

            </tr>

          </thead>

          <tbody>

            {assignments.map((item, index) => (

              <tr
                key={item.nozzle}
                className="border-b border-gray-800"
              >

                <td className="py-4 text-white">
                  {item.nozzle}
                </td>

                <td className="text-green-400">
                  {item.fuel}
                </td>

                <td>

                  <select
                    value={item.attendant}
                    onChange={(e) =>
                      update(index, e.target.value)
                    }
                    className="w-full rounded-lg bg-[#0E1116] p-3 text-white"
                  >

                    <option value="">
                      Select Attendant
                    </option>

                    {attendants.map((person) => (

                      <option
                        key={person.id}
                        value={person.name}
                      >
                        {person.name}
                      </option>

                    ))}

                  </select>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <button
        onClick={handleSave}
        className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500"
      >
        Save Shift Assignment
      </button>

    </div>
  );
}