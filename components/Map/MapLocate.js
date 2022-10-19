import { LocationCurrent } from "@carbon/icons-react";
import { useMap } from "react-leaflet";
import useMapStore from "../../store/useMapStore";

export default function MapLocate() {
  const map = useMap();

  function autoLocate() {
    map.locate().on("locationfound", (location) => {
      setPosition(location.latlng);
      map.flyTo(location.latlng);
    });
  }
  return (
    <button className="absolute right-0 top-0 z-50 m-4" onClick={autoLocate}>
      <LocationCurrent size={24} className="drop-shadow-lg" />
    </button>
  );
}
