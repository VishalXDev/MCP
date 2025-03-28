import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(""); 
  const isMounted = useRef(true); // Prevent memory leaks

  useEffect(() => {
    isMounted.current = true;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders-with-locations");
        if (isMounted.current) setOrders(res.data);
      } catch (err) {
        if (isMounted.current) {
          setError(err.response?.data?.message || "Failed to fetch orders.");
        }
      }
    };

    fetchOrders();

    const handleOrderUpdate = (data) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === data.orderId && order.status !== data.status
            ? { ...order, status: data.status }
            : order
        )
      );
    };

    socket.on("orderStatusUpdate", handleOrderUpdate);

    return () => {
      isMounted.current = false;
      socket.off("orderStatusUpdate", handleOrderUpdate);
      socket.disconnect(); // Ensure socket is properly closed
    };
  }, []);

  const statusColors = {
    Completed: "green",
    Pending: "yellow",
    Processing: "blue",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Status</h2>

      {error && <p className="text-red-500">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders available.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id || order.orderId} className="border p-4 rounded-md shadow-md">
              <p>
                <strong>Order {order.orderId}</strong> → Status:{" "}
                <span className={`text-${statusColors[order.status] || "gray"}-500 font-bold`}>
                  {order.status}
                </span>
              </p>

              {order.status === "Completed" && order.proof && (
                <div className="mt-2">
                  <h3 className="font-semibold">Proof of Delivery:</h3>
                  <div className="flex space-x-4">
                    {order.proof.imageUrl && (
                      <img
                        src={order.proof.imageUrl}
                        alt="Package"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    )}
                    {order.proof.signatureUrl && (
                      <img
                        src={order.proof.signatureUrl}
                        alt="Signature"
                        className="w-32 h-32 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
