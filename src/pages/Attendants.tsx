import { useEffect, useState } from "react";
import { useStationStore } from "../store/stationStore";

export default function Attendants() {
  const attendants = useStationStore((state) => state.attendants);
  const loading = useStationStore((state) => state.loading);
  const saving = useStationStore((state) => state.saving);
  const error = useStationStore((state) => state.error);

  const loadAttendants = useStationStore((state) => state.loadAttendants);
  const addAttendant = useStationStore((state) => state.addAttendant);
  const removeAttendant = useStationStore((state) => state.removeAttendant);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadAttendants(1);
  }, [loadAttendants]);

  async function handleAddAttendant() {
    if (!name.trim()) {
      setFormError("Enter the attendant's full name first.");
      return;
    }

    setFormError("");

    try {
      await addAttendant(name.trim(), phone.trim());
      setName("");
      setPhone("");
    } catch (err) {
      console.error("Add attendant failed:", err);
    }
  }

  async function handleRemoveAttendant(id: number) {
    if (!window.confirm("Remove this attendant?")) return;

    try {
      await removeAttendant(id);
    } catch {
      // error state already set in the store
    }
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

      {formError && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">
          {formError}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={saving}
          className="rounded-xl bg-[#171C22] p-3 text-white disabled:opacity-50"
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={saving}
          className="rounded-xl bg-[#171C22] p-3 text-white disabled:opacity-50"
        />

        <button
          onClick={handleAddAttendant}
          disabled={saving}
          className="rounded-xl bg-green-600 font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Attendant"}
        </button>

      </div>

      {loading ? (

        <div className="py-12 text-center text-gray-400">
          Loading attendants...
        </div>

      ) : attendants.length === 0 ? (

        <p className="text-gray-400">
          No attendants registered yet.
        </p>

      ) : (

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

                  <span
                    className={`rounded-full px-3 py-1 text-sm text-white ${
                      person.active
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {person.active ? "Active" : "Inactive"}
                  </span>

                </td>

                <td className="text-right">

                  {person.active && (
                    <button
                      onClick={() => handleRemoveAttendant(person.id)}
                      disabled={saving}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}
