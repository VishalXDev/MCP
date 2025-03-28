import React, { useEffect, useState } from "react";

const OrdersWithLocations = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/mcp/orders-with-locations")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div>
      <h2>Orders with Locations</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            Order ID: {order.orderId} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersWithLocations;
