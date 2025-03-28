let googleMapsPromise = null;

export const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise; // Return the existing Promise if already loading

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Prevent adding multiple script tags
    if (document.querySelector("script[src*='maps.googleapis.com']")) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve(window.google.maps);
    script.onerror = () => {
      reject(new Error("Google Maps API failed to load"));
      googleMapsPromise = null; // Reset promise so future calls can retry
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};
