import React, { useState, useEffect } from "react";
import axios from "../services/api";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("/completed-orders").then((res) => setOrders(res.data));
    axios.get("/wallet-transactions").then((res) => setTransactions(res.data));
  }, []);

  return (
    <div>
      <h2>Order & Transaction History</h2>

      <h3>Completed Orders</h3>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.orderId}>
              Order {order.orderId} → Completed by {order.partnerId} → Proof:{" "}
              {order.proof?.imageUrl && <img src={order.proof.imageUrl} alt="Proof" width="100" />}
            </li>
          ))
        ) : (
          <p>No completed orders</p>
        )}
      </ul>

      <h3>Wallet Transactions</h3>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            {tx.type.toUpperCase()} ₹{tx.amount} - {new Date(tx.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
