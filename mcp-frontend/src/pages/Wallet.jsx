import React, { useState, useEffect } from "react";
import axios from "../services/api";

const Wallet = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    axios.get("/mcp/wallet")
      .then(res => setBalance(res.data.balance))
      .catch(err => console.error("Error fetching wallet balance:", err));
  }, []);

  return (
    <div className="card">
      <h3>Wallet Balance</h3>
      <p>₹{balance}</p>
      <button>Add Funds</button>
    </div>
  );
};

export default Wallet;
