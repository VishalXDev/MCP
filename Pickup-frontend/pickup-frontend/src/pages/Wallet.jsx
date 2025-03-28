import React, { useEffect, useState } from "react";
import { api } from "../api";

function Wallet() {
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get("/pickup/wallet");
      setWallet(response.data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Wallet</h2>
      <p className="text-xl font-semibold">Balance: ₹{wallet.balance}</p>
      <h3 className="text-lg font-semibold mt-4">Transactions</h3>
      <ul>
        {wallet.transactions.map((txn, index) => (
          <li key={index} className="p-2 border rounded my-1">
            {txn.type === "credit" ? "➕" : "➖"} ₹{txn.amount} - {txn.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wallet;
