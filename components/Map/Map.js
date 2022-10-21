import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import MapPinDrop from "./MapPinDrop";
import RangeInput from "../Inputs/RangeInput";
import useMapStore from "../../store/useMapStore";
import MapLocate from "./MapLocate";
import { useState } from "react";

export default function LocationPicker({ withRadiusPicker }) {
  const { setRadius, radius, position, listingPosition } = useMapStore();
  const [initialMode, setInitialMode] = useState(
    Object.keys(listingPosition).length ? true : false
  );
  const center = useMemo(() => [12.8797, 121.774], []);

  function switchToInitialMode(value) {
    setInitialMode(value);
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {withRadiusPicker && (
        <RangeInput
          min={1}
          max={100}
          label="Radius"
          disabled={
            !Object.keys(position).length &&
            !Object.keys(listingPosition).length
          }
          value={radius}
          valueEndText="km"
          onChange={(value) => {
            setRadius(value);
          }}
        />
      )}
      <div className="relative flex h-full w-full overflow-hidden rounded-[10px]">
        <MapLocate />
        <div className="h-full w-full">
          <MapContainer
            center={
              Object.keys(listingPosition).length ? listingPosition : center
            }
            zoom={5}
            className="z-40 h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPinDrop
              initialMode={initialMode}
              switchToInitialMode={(value) => switchToInitialMode(value)}
            />
            {withRadiusPicker &&
            (Object.keys(listingPosition).length ||
              Object.keys(position).length) ? (
              <Circle
                center={initialMode ? listingPosition : position}
                pathOptions={{ color: "#85CB33" }}
                radius={radius * 1000}
              />
            ) : null}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
