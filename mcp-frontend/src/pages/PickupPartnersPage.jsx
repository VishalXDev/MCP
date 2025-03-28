import React, { useEffect, lazy, Suspense } from "react";

const PickupPartners = lazy(() => import("../components/PickupPartners"));

const PickupPartnersPage = () => {
  useEffect(() => {
    document.title = "Pickup Partners - YourApp"; // Dynamic title for better SEO
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800" role="heading">
        Pickup Partners
      </h2>

      <section aria-live="polite">
        <Suspense fallback={<p className="text-gray-500">Loading partners...</p>}>
          <PickupPartners />
        </Suspense>
      </section>
    </main>
  );
};

export default PickupPartnersPage;
