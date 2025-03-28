// src/components/History.js
import React, { useState, useEffect } from "react";
import api from "../services/api"; // ✅ Fix import

const CompletedOrders = ({ orders }) => (
  <div className="mb-6">
    <h3 className="text-xl font-medium mb-2">Completed Orders</h3>
    <ul className="space-y-2">
      {orders.length > 0 ? (
        orders.map((order) => (
          <li
            key={order.orderId}
            className="p-3 border rounded-md bg-gray-50 shadow-md hover:bg-gray-100 transition"
          >
            <span className="font-semibold">Order {order.orderId}</span> → Completed by{" "}
            <span className="text-blue-600">{order.partnerId}</span>
            {order.proof?.imageUrl && (
              <img
                src={order.proof.imageUrl}
                alt={`Proof for order ${order.orderId}`}
                className="mt-2 rounded-md shadow-md"
                width="100"
              />
            )}
          </li>
        ))
      ) : (
        <p className="text-gray-500">No completed orders</p>
      )}
    </ul>
  </div>
);

const WalletTransactions = ({ transactions }) => (
  <div>
    <h3 className="text-xl font-medium mb-2">Wallet Transactions</h3>
    <ul className="space-y-2">
      {transactions.length > 0 ? (
        transactions.map((tx, index) => (
          <li
            key={index}
            className={`p-3 border rounded-md shadow-md ${
              tx.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            } hover:opacity-80 transition`}
          >
            <span className="font-semibold">{tx.type.toUpperCase()}</span> ₹{tx.amount} -{" "}
            {new Date(tx.timestamp).toLocaleString()}
          </li>
        ))
      ) : (
        <p className="text-gray-500">No transactions available</p>
      )}
    </ul>
  </div>
);

const History = () => {
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, transactionsRes] = await Promise.all([
          api.get("/completed-orders"), // ✅ Use axios instance
          api.get("/wallet-transactions"),
        ]);
        setOrders(ordersRes.data);
        setTransactions(transactionsRes.data);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Order & Transaction History</h2>

      {loading ? (
        <p className="text-gray-500" aria-live="polite">Loading history...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <CompletedOrders orders={orders} />
          <WalletTransactions transactions={transactions} />
        </>
      )}
    </div>
  );
};

export default History;
