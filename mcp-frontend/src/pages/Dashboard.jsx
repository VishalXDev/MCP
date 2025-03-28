import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h1>MCP Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/orders-with-locations">Orders With Locations</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
