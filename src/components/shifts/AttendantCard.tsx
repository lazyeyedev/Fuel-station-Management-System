interface Props {
  name: string;
  selected: boolean;
  onClick: () => void;
}

export default function AttendantCard({
  name,
  selected,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-green-500 bg-green-600 text-white"
          : "border-gray-700 bg-[#171C22] text-gray-300 hover:border-green-500"
      }`}
    >
      <h3 className="font-semibold">{name}</h3>
    </button>
  );
}