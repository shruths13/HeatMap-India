import { motion } from "framer-motion";
import CountUp from "react-countup";

const RISK_STYLES = {
  DANGER: { badge: "bg-red-500", score: "text-red-400" },
  HIGH: { badge: "bg-amber-500", score: "text-amber-400" },
  MODERATE: { badge: "bg-yellow-400", score: "text-yellow-300" },
  LOW: { badge: "bg-green-500", score: "text-green-400" },
  SAFE: { badge: "bg-teal-500", score: "text-teal-400" },
};

function StatChip({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-800 p-3 text-center">
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-xs text-gray-400">{label}</div>
    </div>
  );
}

export default function WardCard({ ward, onClose }) {
  const styles = RISK_STYLES[ward?.risk] || RISK_STYLES.LOW;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute bottom-0 left-0 right-0 z-[1100] rounded-t-3xl border-t border-gray-700 bg-gray-900/95 p-6 text-white shadow-2xl backdrop-blur-md"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{ward?.name}</h2>
          <p className="text-sm text-gray-400">{ward?.city}</p>
        </div>

        <div className="text-right">
          <div className={`text-5xl font-black ${styles.score}`}>
            <CountUp end={ward?.score || 0} duration={1.2} decimals={1} />
          </div>
          <div className="text-xs text-gray-400">Heat Score / 10</div>
        </div>
      </div>

      <span
        className={`inline-block rounded-full px-4 py-1 text-xs font-bold text-white ${styles.badge}`}
      >
        {ward?.risk}
      </span>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatChip label="Air Temp" value={`${ward?.air_temp ?? "--"}°C`} />
        <StatChip label="Feels Like" value={`${ward?.feels_like ?? "--"}°C`} />
        <StatChip label="Humidity" value={`${ward?.humidity ?? "--"}%`} />
      </div>

      <div className="mt-5 rounded-2xl border border-gray-700 bg-gray-800/80 p-4">
        <div className="mb-1 text-sm font-semibold text-teal-400">Top Action</div>
        <p className="text-sm text-gray-300">
          Install cooling stations, improve green cover, and issue local heat safety alerts.
        </p>
      </div>

      <button
        onClick={onClose}
        className="mt-5 w-full rounded-xl bg-teal-600 py-3 font-semibold transition hover:bg-teal-500"
      >
        Close
      </button>
    </motion.div>
  );
}