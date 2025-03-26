import React, { useState, useEffect } from "react";
import axios from "../services/api";

const PickupPartners = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axios.get("/mcp/pickup-partners").then((res) => setPartners(res.data));
  }, []);

  return (
    <div>
      <h3>Pickup Partners</h3>
      {partners.map((partner) => (
        <div key={partner._id}>
          <p>Name: {partner.name}</p>
          <p>Status: {partner.status}</p>
        </div>
      ))}
    </div>
  );
};

export default PickupPartners;
