import { useState, useEffect } from "react";
import useMapStore from "../../store/useMapStore";

export default function useCreationLocationChange(region, lat, lng) {
  const { creationRegion, creationPosition } = useMapStore();
  const [location, setLocation] = useState({
    region,
    lat,
    lng,
  });

  useEffect(() => {
    setLocation(() => ({
      region: creationRegion,
      lat: creationPosition.lat,
      lng: creationPosition.lng,
    }));
  }, [creationRegion, creationPosition.lat, creationPosition.lng]);

  return location;
}
