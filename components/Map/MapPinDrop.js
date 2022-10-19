import { Marker, Popup, useMapEvent } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { LocationFilled } from "@carbon/icons-react";
import { divIcon } from "leaflet";
import useMapStore from "../../store/useMapStore";
import { useRef, useMemo } from "react";

export default function MapPinDrop() {
  // const [position, setPosition] = useState(null);
  const { position, setPosition } = useMapStore();
  const iconMarkup = renderToStaticMarkup(
    <div className="text-danger-500">
      <LocationFilled size={32} />
    </div>
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
    iconSize: [32, 32],
    className: "drop-shadow-md",
  });

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const map = useMapEvent("click", (location) => {
    setPosition(location.latlng);
  });

  return !Object.keys(position).length ? null : (
    <Marker
      position={position}
      icon={customMarkerIcon}
      draggable={true}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup>
        lat:{position.lat} lng:{position.lng}
      </Popup>
    </Marker>
  );
}
