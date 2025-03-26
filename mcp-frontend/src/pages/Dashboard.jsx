import React, { useState, useEffect } from "react";
import api from "../services/api";
import io from "socket.io-client";
import MapView from "../components/MapView";

const socket = io(import.meta.env.VITE_API_BASE_URL);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState({});
  const [center, setCenter] = useState({ lat: 28.7041, lng: 77.1025 });

  useEffect(() => {
    api.get("/orders-with-locations").then((res) => setOrders(res.data));

    socket.on("locationUpdate", (locations) => setPartners(locations));
    socket.on("orderStatusUpdate", (data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    return () => {
      socket.off("locationUpdate");
      socket.off("orderStatusUpdate");
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Live Order Tracking</h2>
      <MapView center={center} orders={orders} partners={partners} />
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.orderId} className="order-item">
            Order {order.orderId} → Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
