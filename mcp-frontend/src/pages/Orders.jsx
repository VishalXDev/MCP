import React, { useState, useEffect } from "react";
import axios from "../services/api";
import io from "socket.io-client";
import api from "../services/api";
const socket = io("http://localhost:5000");

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders-with-locations").then((res) => setOrders(res.data));

    socket.on("orderStatusUpdate", (data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    return () => socket.off("orderStatusUpdate");
  }, []);

  return (
    <div>
      <h2>Order Status</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            Order {order.orderId} → Status: {order.status}
            {order.status === "Completed" && order.proof && (
              <div>
                <h3>Proof of Delivery:</h3>
                {order.proof.imageUrl && <img src={order.proof.imageUrl} alt="Package Image" width="200" />}
                {order.proof.signatureUrl && <img src={order.proof.signatureUrl} alt="Customer Signature" width="200" />}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
api.get("/orders-with-locations").then((res) => setOrders(res.data));
export default Orders;
