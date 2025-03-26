import React from "react";

const OrderItem = ({ order }) => {
  return (
    <div className="order-item">
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
    </div>
  );
};

export default OrderItem;
