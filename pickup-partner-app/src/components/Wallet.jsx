import React, { useState, useEffect } from "react";
import axios from "../services/api";

const Wallet = ({ partnerId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("/wallet-transactions").then((res) => setTransactions(res.data));
  }, []);

  return (
    <div>
      <h3>Your Wallet History</h3>
      {transactions.length > 0 ? (
        <ul>
          {transactions
            .filter((tx) => tx.partnerId === partnerId) // 🔥 Now dynamically filtering
            .map((tx, index) => (
              <li key={index}>
                {tx.type.toUpperCase()} ₹{tx.amount} -{" "}
                {new Date(tx.timestamp).toLocaleString()}
              </li>
            ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};
api.get("/partner-orders/partner1").then((res) => setOrders(res.data));
export default Wallet;
