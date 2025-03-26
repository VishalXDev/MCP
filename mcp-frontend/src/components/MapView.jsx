import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

const MapView = ({ center, orders, partners }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (orders.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      const { pickup, dropoff } = orders[0];

      directionsService.route(
        { origin: pickup, destination: dropoff, travelMode: "DRIVING" },
        (result, status) => {
          if (status === "OK") setDirections(result);
          else console.error("Error fetching directions", status);
        }
      );
    }
  }, [orders]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {partners && Object.entries(partners).map(([id, loc]) => (
        <Marker key={id} position={loc} label="P" />
      ))}
      {orders.map((order, index) => (
        <Marker key={index} position={order.pickup} label="O" />
      ))}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default MapView;
