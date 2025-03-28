import React, { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

const Home = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      
      <Suspense fallback={<p className="text-gray-500">Loading dashboard...</p>}>
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default Home;
