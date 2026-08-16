import { useMemo, useState } from "react";
import { useDailyStore } from "../store/dailyStore";
import { useTankStore } from "../store/tankStore";

interface Tank {
  id: number;
  storeId: string;
  name: string;
  fuel: "Super" | "Diesel";
  capacity: number;
  opening: string;
  receipt: string;
  dip: string;
}

export default function TankManagement() {
  const daily = useDailyStore((s) => s.daily);

  const updateTank = useTankStore((s) => s.updateTank);

  const [tanks, setTanks] = useState<Tank[]>([
    {
      id: 1,
      storeId: "tank-super",
      name: "Super Tank",
      fuel: "Super",
      capacity: 45000,
      opening: "",
      receipt: "",
      dip: "",
    },
    {
      id: 2,
      storeId: "tank-diesel1",
      name: "Diesel Tank 1",
      fuel: "Diesel",
      capacity: 45000,
      opening: "",
      receipt: "",
      dip: "",
    },
    {
      id: 3,
      storeId: "tank-diesel2",
      name: "Diesel Tank 2",
      fuel: "Diesel",
      capacity: 36000,
      opening: "",
      receipt: "",
      dip: "",
    },
  ]);

  function update(
    index: number,
    field: "opening" | "receipt" | "dip",
    value: string
  ) {
    const copy = [...tanks];
    copy[index][field] = value;
    setTanks(copy);
  }

  function money(value: number) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function status(closing: number, capacity: number) {
    if (capacity === 45000) {
      if (closing <= 22500) return "LOW";
      if (closing <= 36000) return "WARNING";
      return "NORMAL";
    }

    if (closing <= 18000) return "LOW";
    if (closing <= 27000) return "WARNING";
    return "NORMAL";
  }

  function statusColor(value: string) {
    switch (value) {
      case "LOW":
        return "text-red-500";
      case "WARNING":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  }

  const rows = useMemo(() => {
    return tanks.map((tank) => {
      const opening = Number(tank.opening || 0);
      const receipt = Number(tank.receipt || 0);

      const sales =
        tank.fuel === "Super"
          ? daily.superLitres
          : daily.dieselLitres;

      const expected = opening + receipt - sales;

      const dip = Number(tank.dip || 0);

      const variance = dip - expected;

      return {
        ...tank,
        sales,
        expected,
        variance,
      };
    });
  }, [tanks, daily]);
function saveTankRecord() {
  rows.forEach((tank) => {
    const opening = Number(tank.opening || 0);

    // Skip tanks that haven't been filled in
    if (opening <= 0) {
      return;
    }

    updateTank(tank.storeId, tank.expected);
  });

  alert("Tank Record Saved Successfully");
}
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Tank Management
        </h1>

        <p className="text-gray-400">
          Daily Tank Reconciliation
        </p>
      </div>

      <div className="rounded-2xl bg-[#171C22] p-6 overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="text-left py-3">Tank</th>
              <th>Capacity</th>
              <th>Opening</th>
              <th>Receipt</th>
              <th>Pump Sales</th>
              <th>Expected</th>
              <th>Dip</th>
              <th>Variance</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {rows.map((tank, index) => (

              <tr
                key={tank.id}
                className="border-b border-gray-800"
              >

                <td className="py-4 text-white">
                  {tank.name}
                </td>

                <td className="font-semibold text-cyan-400">
                  {money(tank.capacity)}
                </td>

                <td>
                  <input
                    type="number"
                    value={tank.opening}
                    onChange={(e) =>
                      update(index, "opening", e.target.value)
                    }
                    className="w-24 rounded bg-[#0E1116] p-2 text-white"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={tank.receipt}
                    onChange={(e) =>
                      update(index, "receipt", e.target.value)
                    }
                    className="w-24 rounded bg-[#0E1116] p-2 text-white"
                  />
                </td>

                <td className="font-bold text-blue-400">
                  {money(tank.sales)}
                </td>

                <td className="font-bold text-yellow-400">
                  {money(tank.expected)}
                </td>

                <td>
                  <input
                    type="number"
                    value={tank.dip}
                    onChange={(e) =>
                      update(index, "dip", e.target.value)
                    }
                    className="w-24 rounded bg-[#0E1116] p-2 text-white"
                  />
                </td>

                <td
                  className={`font-bold ${
                    tank.variance === 0
                      ? "text-green-400"
                      : tank.variance > 0
                      ? "text-yellow-400"
                      : "text-red-500"
                  }`}
                >
                  {money(tank.variance)}
                </td>

                <td
                  className={`font-bold ${statusColor(
                    status(
                      tank.expected,
                      tank.capacity
                    )
                  )}`}
                >
                  {status(
                    tank.expected,
                    tank.capacity
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-end">

        <button
          onClick={saveTankRecord}
          className="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-500"
        >
          Save Tank Record
        </button>

      </div>

    </div>
  );
}