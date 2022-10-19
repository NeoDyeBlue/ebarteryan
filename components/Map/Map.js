import { MapContainer, TileLayer, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import MapPinDrop from "./MapPinDrop";
import RangeInput from "../Inputs/RangeInput";
import useMapStore from "../../store/useMapStore";

export default function LocationPicker({ withRadiusPicker }) {
  const { setRadius, radius, position, setPosition } = useMapStore();
  const center = useMemo(() => [12.8797, 121.774], []);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {withRadiusPicker && (
        <RangeInput
          min={1}
          max={100}
          label="Radius"
          disabled={Object.keys(position).length ? false : true}
          value={radius}
          valueEndText="km"
          onChange={(value) => {
            setRadius(value);
          }}
        />
      )}
      <div className="h-full w-full overflow-hidden rounded-[10px]">
        <MapContainer
          center={center}
          zoom={5}
          // scrollWheelZoom={false}
          className="z-40 h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapPinDrop />
          {withRadiusPicker && Object.keys(position).length && (
            <Circle
              center={position}
              pathOptions={{ color: "#85CB33" }}
              radius={radius * 1000}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
