import React, { useState, useEffect } from "react";
import axios from "../services/api";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/mcp/orders").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="card">
      <h3>Orders</h3>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="p-4 border rounded-md mb-3 bg-gray-50">
            <p>Order ID: {order._id}</p>
            <p>Status: {order.status}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No orders available.</p>
      )}
    </div>
  );
};

export default OrderList;
