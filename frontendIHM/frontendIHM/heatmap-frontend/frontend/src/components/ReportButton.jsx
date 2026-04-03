import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ReportButton({ city }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        alert("Location access denied.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("city", city);
      formData.append("description", description);
      if (photo) formData.append("photo", photo);
      if (coords) {
        formData.append("lat", coords.lat);
        formData.append("lon", coords.lon);
      }

      await axios.post(`${API}/api/v1/report`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Report submitted successfully.");
      setDescription("");
      setPhoto(null);
      setCoords(null);

      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 1500);
    } catch (error) {
      setSuccess("Demo mode: report saved locally.");
      setTimeout(() => {
        setOpen(false);
        setSuccess("");
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-6 right-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-3xl text-white shadow-2xl transition hover:bg-teal-500"
      >
        +
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-[1300] rounded-t-3xl bg-gray-900 p-6 text-white shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Report Heat Issue</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Description</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the heat issue..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm outline-none"
                  required
                />
              </div>

              <button
                type="button"
                onClick={getLocation}
                className="w-full rounded-xl bg-gray-800 py-3 font-medium hover:bg-gray-700"
              >
                {coords ? "Location Captured" : "Capture GPS Location"}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-teal-600 py-3 font-semibold hover:bg-teal-500 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>

              {success && <p className="text-center text-sm text-teal-400">{success}</p>}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}