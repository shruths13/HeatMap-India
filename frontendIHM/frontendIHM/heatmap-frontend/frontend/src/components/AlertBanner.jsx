export default function AlertBanner({ alert, onClick }) {
  if (!alert) return null;

  const text =
    typeof alert === "string"
      ? alert
      : alert.message || `⚠ ${alert.ward} has entered a danger zone.`;

  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-0 z-[1200] w-full bg-red-500 px-4 py-3 text-left text-sm font-medium text-white shadow-lg"
    >
      {text}
    </button>
  );
}