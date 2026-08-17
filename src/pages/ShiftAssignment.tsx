import { useEffect, useState } from "react";
import {
  createShift,
  getShiftOptions,
  type ShiftOptionAttendant,
  type ShiftOptionNozzle,
} from "../api";

interface Assignment {
  nozzle: ShiftOptionNozzle;
  attendantId: string;
}

export default function ShiftAssignment() {
  const stationId = 1;

  const [date] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [shift, setShift] = useState<
    "MORNING" | "AFTERNOON" | "NIGHT"
  >("MORNING");

  const [manager, setManager] = useState("");

  const [nozzles, setNozzles] = useState<
    ShiftOptionNozzle[]
  >([]);

  const [attendants, setAttendants] = useState<
    ShiftOptionAttendant[]
  >([]);

  const [assignments, setAssignments] = useState<
    Assignment[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        setError("");

        const data = await getShiftOptions(
          stationId
        );

        setNozzles(data.nozzles);
        setAttendants(data.attendants);

        setAssignments(
          data.nozzles.map((nozzle) => ({
            nozzle,
            attendantId: "",
          }))
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load shift data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  function updateAttendant(
    nozzleId: number,
    attendantId: string
  ) {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.nozzle.id === nozzleId
          ? {
              ...assignment,
              attendantId,
            }
          : assignment
      )
    );
  }

  async function handleSave() {
    const selectedAssignments =
      assignments.filter(
        (assignment) =>
          assignment.attendantId !== ""
      );

    if (selectedAssignments.length === 0) {
      alert(
        "Please assign at least one attendant before saving."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await createShift({
        stationId,
        shiftDate: date,
        shiftType: shift,
        managerId: null,
        assignments:
          selectedAssignments.map(
            (assignment) => ({
              nozzleId: assignment.nozzle.id,
              attendantId: Number(
                assignment.attendantId
              ),
            })
          ),
      });

      alert(
        `Shift ${response.data.id} created successfully.`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save shift"
      );
    } finally {
      setSaving(false);
    }
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

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 rounded-2xl bg-[#171C22] p-6">

        <input
          type="date"
          value={date}
          readOnly
          className="rounded-xl bg-[#0E1116] p-3 text-white"
        />

        <select
          value={shift}
          onChange={(e) =>
            setShift(
              e.target.value as
                | "MORNING"
                | "AFTERNOON"
                | "NIGHT"
            )
          }
          className="rounded-xl bg-[#0E1116] p-3 text-white"
        >
          <option value="MORNING">
            Morning
          </option>

          <option value="AFTERNOON">
            Afternoon
          </option>

          <option value="NIGHT">
            Night
          </option>
        </select>

        <input
          value={manager}
          onChange={(e) =>
            setManager(e.target.value)
          }
          placeholder="Manager"
          className="rounded-xl bg-[#0E1116] p-3 text-white"
        />

      </div>

      <div className="rounded-2xl bg-[#171C22] p-6">

        {loading ? (
          <div className="py-12 text-center text-gray-400">
            Loading pumps and nozzles...
          </div>
        ) : (
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

              {assignments.map(
                (assignment) => (

                  <tr
                    key={assignment.nozzle.id}
                    className="border-b border-gray-800"
                  >

                    <td className="py-4 text-white">
                      {assignment.nozzle.nozzle_name}
                    </td>

                    <td className="text-green-400">
                      {assignment.nozzle.fuel_type_name}
                    </td>

                    <td>

                      <select
                        value={
                          assignment.attendantId
                        }
                        onChange={(e) =>
                          updateAttendant(
                            assignment.nozzle.id,
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg bg-[#0E1116] p-3 text-white"
                      >

                        <option value="">
                          Select Attendant
                        </option>

                        {attendants.map(
                          (person) => (

                            <option
                              key={person.id}
                              value={person.id}
                            >
                              {person.full_name}
                            </option>

                          )
                        )}

                      </select>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>
        )}

      </div>

      <button
        onClick={handleSave}
        disabled={
          saving ||
          loading ||
          attendants.length === 0
        }
        className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : "Save Shift Assignment"}
      </button>

      {attendants.length === 0 &&
        !loading && (
          <p className="text-sm text-yellow-400">
            No active attendants are registered
            for this station yet. Add attendants
            before creating a shift assignment.
          </p>
        )}

    </div>
  );
}