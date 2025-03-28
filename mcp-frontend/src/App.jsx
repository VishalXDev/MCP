import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import OrdersWithLocations from "./pages/OrdersWithLocations";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/orders-with-locations" element={<OrdersWithLocations />} />
      </Routes>
    </Router>
  );
};

export default App;
