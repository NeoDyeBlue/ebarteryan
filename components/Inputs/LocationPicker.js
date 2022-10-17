import { useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

export default function LocationPicker() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
  });

  console.log(process.env.GOOGLE_API_KEY);

  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => setMap(null), []);

  const [map, setMap] = useState(null);

  return isLoaded ? (
    <GoogleMap
      //   mapContainerStyle={containerStyle}
      mapContainerClassName="w-full h-full min-h-[400px]"
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <div className="h-full min-h-[60vh] w-full animate-pulse rounded-[10px] bg-gray-100"></div>
  );
}
