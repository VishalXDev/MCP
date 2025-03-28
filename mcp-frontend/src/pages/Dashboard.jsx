import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">MCP Dashboard</h1>
      <p className="text-gray-600 mb-4">Manage your orders and wallet efficiently.</p>

      <nav className="bg-gray-100 p-4 rounded-lg shadow-md">
        <ul className="space-y-3">
          <li>
            <Link
              to="/orders"
              className="block text-blue-600 font-semibold hover:underline"
            >
              📦 Orders
            </Link>
          </li>
          <li>
            <Link
              to="/wallet"
              className="block text-green-600 font-semibold hover:underline"
            >
              💰 Wallet
            </Link>
          </li>
          <li>
            <Link
              to="/orders-with-locations"
              className="block text-purple-600 font-semibold hover:underline"
            >
              📍 Orders With Locations
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
