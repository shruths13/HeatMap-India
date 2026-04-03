import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import axios from "axios";
import mockData from "./mockData";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getColor(score) {
  if (score >= 9) return "#E24B4A";
  if (score >= 7) return "#BA7517";
  if (score >= 5) return "#EF9F27";
  if (score >= 3) return "#639922";
  return "#1D9E75";
}

export default function HeatMap({ city = "chennai" }) {
  const [geoData, setGeoData] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  
  // Modal states
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isInterventionsOpen, setIsInterventionsOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/v1/heatmap/${city}`)
      .then((res) => setGeoData(res.data))
      .catch((err) => {
        console.error("Backend fetch failed, using mock data:", err);
        setGeoData(mockData);
      });
  }, [city]);

  const wardStyle = (feature) => {
    const score = feature?.properties?.score ?? 1;
    return {
      color: "#ffffff",
      weight: 1,
      opacity: 0.5,
      fillColor: getColor(score),
      fillOpacity: 0.7,
    };
  };

  const onEachWard = (feature, layer) => {
    layer.on({
      click: (e) => {
        setSelectedWard(feature.properties);
      },
      mouseover: (e) => {
        const lyr = e.target;
        lyr.setStyle({ weight: 2, color: "#000", fillOpacity: 0.9 });
        lyr.bringToFront();
      },
      mouseout: (e) => {
        const lyr = e.target;
        lyr.setStyle({ weight: 1, color: "#ffffff", fillOpacity: 0.7 });
      },
    });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const issue = data.get("issue");
    
    // Attempt real submit, fallback to fake success
    axios.post(`${API}/api/v1/report`, {
      description: issue,
      lat: 13.0827,
      lon: 80.2707
    }).then(res => {
      alert(res.data.message || "Report logged successfully!");
      setIsReportOpen(false);
    }).catch(err => {
      alert("Fallback mode: Report virtually logged safely (backend down).");
      setIsReportOpen(false);
    });
  };

  const fetchInterventions = async () => {
    if (!selectedWard) return;
    
    // First safely look for nested data if available from backend directly or mockData
    if (selectedWard.interventions) {
        setIsInterventionsOpen(true);
        return;
    }

    try {
        const id = selectedWard.id || selectedWard.name || "1";
        const res = await axios.get(`${API}/api/v1/ward/${id}`);
        if(res.data.interventions) {
             setSelectedWard(prev => ({...prev, interventions: res.data.interventions}));
        }
    } catch(err) {
        console.error("Safe fallback: backend missing detail endpoint config");
        const fallbackInterventions = [
            {name: "Community Awareness Campaign", description: "Use hydration effectively.", cost: "₹20K", cooling: 0.0, timeline: "Immediate"}
        ];
        setSelectedWard(prev => ({...prev, interventions: fallbackInterventions}));
    }
    setIsInterventionsOpen(true);
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer center={[13.0827, 80.2707]} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && <GeoJSON data={geoData} style={wardStyle} onEachFeature={onEachWard} />}
      </MapContainer>

      {/* Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded shadow pointer-events-auto">
        <h4 className="font-bold mb-2 text-sm text-gray-800">Heat Score</h4>
        <div className="flex flex-col gap-1 text-xs text-gray-700">
          <div className="flex items-center gap-2"><div className="w-4 h-4" style={{backgroundColor: "#E24B4A"}}></div><span>9-10 (Danger)</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4" style={{backgroundColor: "#BA7517"}}></div><span>7-8 (Amber)</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4" style={{backgroundColor: "#EF9F27"}}></div><span>5-6 (Yellow)</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4" style={{backgroundColor: "#639922"}}></div><span>3-4 (Green)</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4" style={{backgroundColor: "#1D9E75"}}></div><span>1-2 (Teal)</span></div>
        </div>
      </div>

      {/* Report Button */}
      <button onClick={() => setIsReportOpen(true)} className="absolute bottom-6 right-6 z-[1000] bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 pointer-events-auto flex items-center gap-2">
        <span className="text-xl">+</span> Report Issue
      </button>

      {/* Bottom Sheet / Ward Card */}
      {selectedWard && (
        <div className="absolute bottom-0 left-0 w-full md:w-[400px] md:bottom-6 md:left-6 z-[1000] bg-white rounded-t-2xl md:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] p-5 pointer-events-auto transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedWard.name || "Unknown Ward"}</h3>
              <p className="text-sm text-gray-500">Selected Ward Information</p>
            </div>
            <button onClick={() => setSelectedWard(null)} className="text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded-full px-2">✕</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Heat Score</p>
              <p className="text-2xl font-bold" style={{color: getColor(selectedWard.score || 0)}}>
                {selectedWard.score || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Air Temp</p>
              <p className="text-2xl font-bold text-gray-800">
                {selectedWard.air_temp || "--"}°C
              </p>
            </div>
          </div>
          
          {selectedWard.ai_active && (
              <div className="text-xs text-blue-700 bg-blue-50 border border-blue-100 p-2 rounded mb-2 font-semibold">🤖 Advanced ML Analysis Available</div>
          )}

          <div className="bg-orange-50 text-orange-800 p-3 rounded text-sm mb-4 border border-orange-100">
            <strong>Risk Status:</strong> {selectedWard.risk || "Moderate Risk."}
          </div>

          <button onClick={fetchInterventions} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
            View Interventions
          </button>
        </div>
      )}

      {/* Report Modal */}
      {isReportOpen && (
        <div className="absolute inset-0 bg-black/50 z-[2000] flex items-center justify-center pointer-events-auto">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Report Heat Emergency</h2>
            <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
              <textarea name="issue" className="w-full border p-2 rounded h-24" placeholder="Describe the heat exposure, lack of shade, or water shortage issue..." required></textarea>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsReportOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interventions Modal */}
      {isInterventionsOpen && selectedWard && (
        <div className="absolute inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Action Plan: {selectedWard.name}</h2>
                <button onClick={() => setIsInterventionsOpen(false)} className="text-xl">✕</button>
            </div>
            
            <div className="flex flex-col gap-4">
                {selectedWard.interventions && selectedWard.interventions.length > 0 ? (
                    selectedWard.interventions.map((i, idx) => (
                        <div key={idx} className="border border-gray-200 p-4 rounded bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-blue-900">{i.name}</h4>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-bold uppercase">{i.timeline}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{i.description}</p>
                            <div className="flex gap-4 text-xs font-semibold">
                                <span className="text-green-700 bg-green-100 px-2 py-1 rounded">Cost: {i.cost}</span>
                                <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded">Cooling: -{i.cooling}°C</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No specific interventions required.</p>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}