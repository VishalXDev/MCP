import React, { useEffect, useState } from "react";
import { api } from "../api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/pickup/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/pickup/orders/${orderId}/accept`);
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await api.put(`/pickup/orders/${orderId}/reject`);
      fetchOrders();
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/pickup/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="p-4 mb-2 border rounded shadow">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            {order.status === "Pending" && (
              <div className="mt-2">
                <button className="bg-green-500 text-white px-3 py-1 mr-2" onClick={() => handleAcceptOrder(order.id)}>
                  Accept
                </button>
                <button className="bg-red-500 text-white px-3 py-1" onClick={() => handleRejectOrder(order.id)}>
                  Reject
                </button>
              </div>
            )}
            {order.status === "Accepted" && (
              <div className="mt-2">
                <button className="bg-blue-500 text-white px-3 py-1" onClick={() => handleUpdateStatus(order.id, "In Progress")}>
                  Start
                </button>
              </div>
            )}
            {order.status === "In Progress" && (
              <div className="mt-2">
                <button className="bg-green-600 text-white px-3 py-1" onClick={() => handleUpdateStatus(order.id, "Completed")}>
                  Mark as Completed
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
