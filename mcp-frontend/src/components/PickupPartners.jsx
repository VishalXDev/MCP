import React, { useState, useEffect } from "react";
import axios from "../services/api";

const PickupPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPartners = async () => {
      try {
        const res = await axios.get("/mcp/pickup-partners", {
          signal: controller.signal,
          withCredentials: true, // Ensures authentication if needed
        });
        setPartners(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching pickup partners:", err);
          setError(err.response?.data?.message || "Failed to fetch pickup partners");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();

    return () => controller.abort();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600";
      case "inactive":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  if (loading)
    return (
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Pickup Partners</h3>
        <p className="text-gray-500">Loading pickup partners...</p>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Pickup Partners</h3>
      {partners.length > 0 ? (
        <div className="space-y-3">
          {partners.map((partner) => (
            <div key={partner._id} className="p-4 border rounded-md bg-gray-50">
              <p><strong>Name:</strong> {partner.name}</p>
              <p><strong>Status:</strong> <span className={getStatusColor(partner.status)}>{partner.status}</span></p>
              {partner.contact && <p><strong>Contact:</strong> {partner.contact}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pickup partners available.</p>
      )}
    </div>
  );
};

export default PickupPartners;
