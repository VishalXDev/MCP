import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

const MapView = ({ center, orders, partners }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // ✅ Read from .env
  });

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (orders.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      const pickup = orders[0].pickup;
      const dropoff = orders[0].dropoff;

      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Error fetching directions", status);
          }
        }
      );
    }
  }, [orders]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {partners &&
        Object.entries(partners).map(([partnerId, loc]) => (
          <Marker key={partnerId} position={{ lat: loc.lat, lng: loc.lng }} label="P" />
        ))}
      {orders &&
        orders.map((order, index) => (
          <Marker key={index} position={order.pickup} label="O" />
        ))}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default MapView;
