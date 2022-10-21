import { Marker, Popup, useMapEvent } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { LocationFilled } from "@carbon/icons-react";
import { divIcon } from "leaflet";
import useMapStore from "../../store/useMapStore";
import { useRef, useMemo, useEffect } from "react";
import useSWR from "swr";

export default function MapPinDrop({ initialMode, switchToInitialMode }) {
  const { position, setPosition, setMap, setRegion, region, listingPosition } =
    useMapStore();
  const { data: revGeoCoding, error } = useSWR(() =>
    Object.keys(position).length
      ? `https://api.tomtom.com/search/2/reverseGeocode/${position.lat},${position.lng}.json?key=awbTtEIZufAop7NYalmH11BPHSzr0QYv`
      : null
  );
  const iconMarkup = renderToStaticMarkup(
    <div className="text-danger-500">
      <LocationFilled size={32} />
    </div>
  );

  useEffect(() => {
    if (revGeoCoding?.addresses) {
      console.log(revGeoCoding.addresses);
      const city = revGeoCoding.addresses[0].address.municipality;
      const state =
        revGeoCoding.addresses[0].address.countrySecondarySubdivision;

      if (city && state) {
        setRegion(`${city}, ${state}`);
      } else {
        setRegion("");
      }
    }
  }, [revGeoCoding]);

  const map = useMapEvent("click", (location) => {
    switchToInitialMode(true);
    setPosition(location.latlng);
    console.log(location.latlng);
  });

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
          switchToInitialMode(true);
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  useEffect(() => setMap(map), [map]);

  return !Object.keys(position).length ||
    !Object.keys(listingPosition).length ? null : (
    <Marker
      position={initialMode ? listingPosition : position}
      icon={customMarkerIcon}
      draggable={true}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup>{!revGeoCoding ? "Loading..." : region}</Popup>
    </Marker>
  );
}
