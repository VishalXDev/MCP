import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ lat = 28.7041, lng = 77.1025, zoom = 10 }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <GoogleMap
      center={{ lat, lng }}
      zoom={zoom}
      mapContainerStyle={{ height: "400px", width: "100%" }}
    />
  );
};

export default MapComponent;
