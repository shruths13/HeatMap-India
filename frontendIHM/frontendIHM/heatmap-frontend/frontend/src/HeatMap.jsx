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

function HeatLegend() {
  const map = useMap();
  useEffect(() => {
    // A simple react-leaflet component that doesn't need to hook into leaflet DOM directly
    // Wait, let's just make it a floating absolute div over the map container instead 
  }, [map]);
  return null;
}

export default function HeatMap({ city = "chennai" }) {
  const [geoData, setGeoData] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

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
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: "#000",
          fillOpacity: 0.9,
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        // Reset style needs to happen by re-computing or geojson global reset
        // For simplicity, we just use static values that match baseline
        const score = feature?.properties?.score ?? 1;
        layer.setStyle({
          weight: 1,
          color: "#ffffff",
          fillOpacity: 0.7,
        });
      },
    });
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={wardStyle} 
            onEachFeature={onEachWard} 
          />
        )}
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
      <button className="absolute bottom-6 right-6 z-[1000] bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 pointer-events-auto flex items-center gap-2">
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
            <button 
              onClick={() => setSelectedWard(null)}
              className="text-gray-400 hover:text-black hover:bg-gray-100 p-1 rounded-full px-2"
            >
              ✕
            </button>
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
          
          <div className="bg-orange-50 text-orange-800 p-3 rounded text-sm mb-4 border border-orange-100">
            <strong>Risk Status:</strong> {selectedWard.risk || "Moderate Risk. Take basic precautions."}
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
            View Interventions
          </button>
        </div>
      )}
    </div>
  );
}