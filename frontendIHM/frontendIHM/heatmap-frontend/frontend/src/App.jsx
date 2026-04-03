import React from "react";
import HeatMap from "./HeatMap";

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* Alert Banner */}
      <div className="absolute top-0 left-0 w-full z-[1000] bg-[#E24B4A] text-white py-2 px-4 flex justify-between items-center shadow-md">
        <div className="font-semibold text-sm md:text-base flex items-center gap-2">
          <span className="text-xl">⚠</span> HeatWave Alert: High Risk in T Nagar (12 PM - 4 PM)
        </div>
        <button className="text-sm bg-white text-[#E24B4A] px-3 py-1 rounded font-bold hover:bg-gray-100 transition-colors">
          View Detail
        </button>
      </div>

      {/* Main Map */}
      <div className="w-full h-full pt-10"> {/* pt-10 to account for alert banner */}
        <HeatMap city="chennai" />
      </div>
    </div>
  );
}

export default App;