import { LocationCurrent } from "@carbon/icons-react";
import useMapStore from "../../store/useMapStore";

export default function MapLocate({ onPositionChange }) {
  const { setPosition, map } = useMapStore();

  function autoLocate() {
    map.locate().on("locationfound", (location) => {
      onPositionChange();
      setPosition(location.latlng);
      map.flyTo(location.latlng, map.getZoom());
    });
  }
  return (
    <button
      className="absolute right-0 top-0 z-50 m-[10px] h-[36px] w-[36px] rounded-full
      border-2 border-[rgba(0,0,0,0.2)] bg-white"
      onClick={autoLocate}
    >
      <LocationCurrent size={16} />
    </button>
  );
}
