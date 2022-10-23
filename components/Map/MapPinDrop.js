import { Marker, Popup, useMapEvent } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { LocationFilled } from "@carbon/icons-react";
import { divIcon } from "leaflet";
import useMapStore from "../../store/useMapStore";
import { useRef, useMemo, useEffect } from "react";
import useSWR from "swr";

const tomtomFetcher = (url, args) =>
  fetch(`${url}/${args.lat},${args.lng}.json?key=${args.token}`).then((r) =>
    r.json()
  );

export default function MapPinDrop({ pinPosition, onPositionChange }) {
  console.log("rerender");
  const { setPosition, setMap, setRegion, region } = useMapStore();
  const { data: revGeoCoding, error } = useSWR(
    [
      "https://api.tomtom.com/search/2/reverseGeocode",
      {
        lat: pinPosition?.lat,
        lng: pinPosition?.lng,
        token: "awbTtEIZufAop7NYalmH11BPHSzr0QYv",
      },
    ],
    tomtomFetcher
  );
  // pinPosition && Object.keys(pinPosition).length
  //   ? `https://api.tomtom.com/search/2/reverseGeocode/${pinPosition?.lat},${pinPosition?.lng}.json?key=awbTtEIZufAop7NYalmH11BPHSzr0QYv`
  //   : null
  const iconMarkup = renderToStaticMarkup(
    <div className="text-danger-500">
      <LocationFilled size={32} />
    </div>
  );

  useEffect(() => {
    if (revGeoCoding?.addresses?.length) {
      console.log(revGeoCoding);
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

  // console.log("rerender", pinPosition);

  const map = useMapEvent("click", (location) => {
    onPositionChange();
    setPosition(location.latlng);
    // mutate();
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
          onPositionChange();
          setPosition(marker.getLatLng());
          // mutate();
        }
      },
    }),
    []
  );

  useEffect(() => setMap(map), [map]);
  // console.log(pinPosition);
  return pinPosition ? (
    <Marker
      position={pinPosition}
      icon={customMarkerIcon}
      draggable={true}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup>
        {!revGeoCoding ? "Loading..." : region ? region : "Unrecognized"}
      </Popup>
    </Marker>
  ) : null;
}
