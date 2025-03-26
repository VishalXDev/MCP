import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Orders from "./pages/Orders";
import History from "./pages/History";

const App = () => {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/">Orders</Link>
        <Link to="/history">History</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
};

export default App;
