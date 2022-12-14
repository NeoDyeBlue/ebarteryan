import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapPinDrop from "./MapPinDrop";
import RangeInput from "../Inputs/RangeInput";
import useMapStore from "../../store/useMapStore";
import MapLocate from "./MapLocate";
import { useState, useMemo } from "react";

export default function Map({ withRadiusPicker, pinPosition }) {
  const { setRadius, radius, position, listingRadius, listingPosition } =
    useMapStore();

  const defaultCenter = [12.8797, 121.774];

  const [isRadiusChanged, setIsRadiusChanged] = useState(false);

  const [inInitialLocation, setInInitialLocation] = useState(
    pinPosition ? true : false
  );

  function setNotInInitialLocation() {
    setInInitialLocation(false);
  }

  const hasPosition = Boolean(position && Object.keys(position).length);
  const hasListingPosition = Boolean(
    listingPosition && Object.keys(listingPosition).length
  );

  const newPinPos = useMemo(() => {
    if (inInitialLocation) {
      return pinPosition;
    } else {
      if (hasPosition) {
        return position;
      }
      return null;
    }
  }, [position, inInitialLocation]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {withRadiusPicker && (
        <RangeInput
          min={1}
          max={100}
          label="Radius"
          // defaultValue={listingRadius ? listingRadius : radius}
          // disabled={!(!initialMode && Object.keys(position).length)}
          value={listingRadius && !isRadiusChanged ? listingRadius : radius}
          valueEndText="km"
          onChange={(value) => {
            // setNotInInitialLocation();
            setIsRadiusChanged(true);
            setRadius(value);
          }}
        />
      )}
      <div className="relative flex h-full w-full overflow-hidden rounded-[10px]">
        <MapLocate onPositionChange={setNotInInitialLocation} />
        <div className="h-full w-full">
          <MapContainer
            center={newPinPos ? newPinPos : defaultCenter}
            zoom={5}
            className="z-40 h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPinDrop
              pinPosition={newPinPos}
              onPositionChange={setNotInInitialLocation}
            />
            {withRadiusPicker && (hasListingPosition || hasPosition) ? (
              <Circle
                center={newPinPos ? newPinPos : defaultCenter}
                pathOptions={{ color: "#85CB33" }}
                radius={
                  listingRadius && !isRadiusChanged
                    ? listingRadius * 1000
                    : radius * 1000
                }
              />
            ) : null}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
