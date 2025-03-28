import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

const MapView = ({ latitude = 28.6139, longitude = 77.2090 }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);

  const mapContainerStyle = useMemo(() => ({ width: "100%", height: "400px" }), []);

  if (loadError) return <div>⚠️ Error loading Google Maps</div>;
  if (!isLoaded) return <div>🗺️ Loading Map...</div>;

  return (
    <GoogleMap zoom={14} center={center} mapContainerStyle={mapContainerStyle}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapView;
