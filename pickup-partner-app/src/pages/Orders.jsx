import React, { useState, useEffect } from "react";
import axios from "../services/api";
import io from "socket.io-client";
import api from "../services/api";
const socket = io("http://localhost:5000");

const Orders = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [image, setImage] = useState(null);
  const [signature, setSignature] = useState(null);

  const partnerId = "partner1"; // 🔥 Replace with real logged-in partner ID

  useEffect(() => {
    socket.on("orderAssigned", (data) => {
      if (data.partnerId === partnerId) {
        setAssignedOrders((prev) => [...prev, { orderId: data.orderId, status: "Assigned" }]);
        alert(`New Order Assigned: ${data.orderId}`);
      }
    });

    return () => socket.off("orderAssigned");
  }, []);

  // ✅ Upload Proof of Delivery
  const handleProofUpload = async (orderId) => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("partnerId", partnerId);
    if (image) formData.append("image", image);
    if (signature) formData.append("signature", signature);

    try {
      const res = await axios.post("/upload-proof", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert(res.data.message);
      setSelectedOrder(null); // Clear selection after upload
    } catch (error) {
      console.error("Upload Error:", error);
    }
  };

  return (
    <div>
      <h2>Your Assigned Orders</h2>
      <ul>
        {assignedOrders.map((order, index) => (
          <li key={index}>
            Order {order.orderId} → Status: {order.status}
            {order.status === "In Progress" && (
              <button onClick={() => setSelectedOrder(order.orderId)}>Complete</button>
            )}
          </li>
        ))}
      </ul>

      {/* ✅ Proof of Delivery Form */}
      {selectedOrder && (
        <div>
          <h3>Upload Proof of Delivery for Order {selectedOrder}</h3>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <input type="file" accept="image/*" onChange={(e) => setSignature(e.target.files[0])} />
          <button onClick={() => handleProofUpload(selectedOrder)}>Upload</button>
        </div>
      )}
    </div>
  );
};
api.get("/partner-orders/partner1").then((res) => setOrders(res.data));
export default Orders;
