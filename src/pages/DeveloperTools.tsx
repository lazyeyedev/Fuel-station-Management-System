import { useDailyStore } from "../store/dailyStore";
import { useShiftStore } from "../store/shiftStore";
import { loadDemoData } from "../utils/demoData";

export default function DeveloperTools() {
  const resetDaily = useDailyStore(
    (s) => s.resetDaily
  );

  const resetShift = useShiftStore(
    (s) => s.resetShift
  );

  function resetEverything() {
    if (
      !window.confirm(
        "Reset the current shift for testing?"
      )
    ) {
      return;
    }

    resetDaily();
    resetShift();

    alert("Shift reset successfully.");
  }

  function loadDemo() {
    loadDemoData();

    alert("Demo data loaded into the in-memory stores.");
  }

  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-[#171C22] p-8">

        <h1 className="text-3xl font-bold text-white">
          Developer Tools
        </h1>

        <p className="mt-2 text-gray-400">
          Testing utilities only.
        </p>

        <div className="mt-8 flex gap-4">

          <button
            onClick={loadDemo}
            className="rounded-xl bg-green-600 px-8 py-4 font-bold text-white hover:bg-green-500"
          >
            Load Demo Data
          </button>

          <button
            onClick={resetEverything}
            className="rounded-xl bg-red-600 px-8 py-4 font-bold text-white hover:bg-red-500"
          >
            Reset Shift
          </button>

        </div>

      </div>

    </div>
  );
}
