import React, { useEffect, useState } from "react";
import { api } from "../api";

function Dashboard() {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch wallet balance
      const walletResponse = await api.get("/pickup/wallet");
      setWallet(walletResponse.data);

      // Fetch recent orders
      const ordersResponse = await api.get("/pickup/orders");
      setOrders(ordersResponse.data.slice(0, 5)); // Show last 5 orders
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Wallet Balance */}
      <div className="bg-blue-500 text-white p-4 rounded-md shadow-md mb-4">
        <h3 className="text-lg font-semibold">Wallet Balance</h3>
        <p className="text-2xl font-bold">₹{wallet.balance}</p>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
        {orders.length === 0 ? (
          <p>No recent orders</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="p-2 border-b">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
