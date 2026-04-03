const levels = [
  { color: "#E24B4A", label: "Danger" },
  { color: "#BA7517", label: "High" },
  { color: "#EF9F27", label: "Moderate" },
  { color: "#639922", label: "Low" },
  { color: "#1D9E75", label: "Safe" },
];

export default function HeatLegend() {
  return (
    <div className="absolute right-4 top-20 z-[1000] w-36 rounded-2xl bg-gray-900/90 p-4 text-white shadow-xl backdrop-blur-md">
      <h3 className="mb-3 text-sm font-bold">Heat Legend</h3>
      <div className="space-y-2">
        {levels.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-200">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}