interface SaveDayButtonProps {
  onSave: () => void;
  canEdit: boolean;
}

export default function SaveDayButton({
  onSave,
  canEdit,
}: SaveDayButtonProps) {
  return (
    <div className="flex justify-end">

      <button
        onClick={onSave}
        disabled={!canEdit}
        className={`rounded-xl px-8 py-3 font-semibold text-white transition ${
          canEdit
            ? "bg-green-600 hover:bg-green-500"
            : "cursor-not-allowed bg-gray-600"
        }`}
      >
        {canEdit
          ? "Save Daily Entry"
          : "Shift Closed"}
      </button>

    </div>
  );
}