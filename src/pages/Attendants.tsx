import { useState } from "react";
import { useStationStore } from "../store/stationStore";

export default function Attendants() {
  const attendants = useStationStore((state) => state.attendants);
  const addAttendant = useStationStore((state) => state.addAttendant);
  const removeAttendant = useStationStore((state) => state.removeAttendant);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  function handleAddAttendant() {
    if (!name.trim()) return;

    addAttendant(name, phone);

    setName("");
    setPhone("");
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Attendants
        </h1>

        <p className="text-gray-400">
          Manage filling station attendants.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl bg-[#171C22] p-3 text-white"
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-xl bg-[#171C22] p-3 text-white"
        />

        <button
          onClick={handleAddAttendant}
          className="rounded-xl bg-green-600 font-semibold text-white hover:bg-green-500"
        >
          Add Attendant
        </button>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b border-gray-700">

            <th className="py-3 text-left text-gray-400">
              Name
            </th>

            <th className="text-left text-gray-400">
              Phone
            </th>

            <th className="text-left text-gray-400">
              Status
            </th>

            <th className="text-right text-gray-400">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {attendants.map((person) => (

            <tr
              key={person.id}
              className="border-b border-gray-800"
            >

              <td className="py-4 text-white">
                {person.name}
              </td>

              <td className="text-gray-300">
                {person.phone || "-"}
              </td>

              <td>

                <span className="rounded-full bg-green-600 px-3 py-1 text-sm text-white">
                  {person.active ? "Active" : "Inactive"}
                </span>

              </td>

              <td className="text-right">

                <button
                  onClick={() => removeAttendant(person.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                >
                  Remove
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}