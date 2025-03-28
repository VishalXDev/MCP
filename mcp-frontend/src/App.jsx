import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import OrdersWithLocations from "./pages/OrdersWithLocations";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/orders-with-locations" element={<OrdersWithLocations />} />
    </Routes>
  );
};

export default App;
