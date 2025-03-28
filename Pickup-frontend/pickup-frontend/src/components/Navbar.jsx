import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Pickup Partner</h1>
        <div>
          <Link className="px-3" to="/">Dashboard</Link>
          <Link className="px-3" to="/orders">Orders</Link>
          <Link className="px-3" to="/wallet">Wallet</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
