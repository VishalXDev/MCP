import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Wallet from "./pages/Wallet";
import "./index.css";

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">MCP Dashboard</header>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/wallet">Wallet</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
