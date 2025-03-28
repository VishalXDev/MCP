import React, { useState, useEffect } from "react";
import axios from "../services/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/mcp/orders", {
          signal: controller.signal,
          withCredentials: true, // Ensures authentication if needed
        });
        setOrders(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching orders:", err);
          setError(err.response?.data?.message || "Failed to fetch orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  if (loading) return <p className="text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Orders</h3>
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded-md bg-gray-50">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> <span className={getStatusColor(order.status)}>{order.status}</span></p>
              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No orders available.</p>
      )}
    </div>
  );
};

export default OrderList;
