import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapPinDrop from "./MapPinDrop";
import RangeInput from "../Inputs/RangeInput";
import useMapStore from "../../store/useMapStore";
import MapLocate from "./MapLocate";
import { useState, useMemo, useEffect } from "react";
import { Search } from "@carbon/icons-react";
import { FormikProvider, Form, useFormik, Field } from "formik";
import { toast } from "react-hot-toast";

export default function Map({ withRadiusPicker, pinPosition }) {
  const {
    setRadius,
    radius,
    position,
    listingRadius,
    listingPosition,
    setPosition,
    setRegion,
  } = useMapStore();

  const defaultCenter = [12.8797, 121.774];

  const [isRadiusChanged, setIsRadiusChanged] = useState(false);

  const [inInitialLocation, setInInitialLocation] = useState(
    pinPosition ? true : false
  );

  const [newPinPos, setNewPinPos] = useState(null);

  const locationSearchFormik = useFormik({
    initialValues: {
      location: "",
    },
    onSubmit: handleLocationSearch,
  });

  async function handleLocationSearch(values) {
    if (location) {
      const result = await fetch(
        `https://api.tomtom.com/search/2/search/${values.location
          .split(" ")
          .join(
            "%20"
          )}.json?entityTypeSet=Municipality&type=geography&key=awbTtEIZufAop7NYalmH11BPHSzr0QYv`
      );
      const data = await result.json();
      if (data?.results?.length) {
        setPosition({
          lat: data?.results[0]?.position?.lat,
          lng: data?.results[0]?.position?.lon,
        });
        setRegion(data?.results[0]?.address?.freeformAddress);
      } else {
        toast.error("Can't find location");
      }
    }
  }

  function setNotInInitialLocation() {
    setInInitialLocation(false);
  }

  const hasListingPosition = Boolean(
    listingPosition && Object.keys(listingPosition).length
  );

  useEffect(() => {
    const hasPosition = Boolean(position && Object.keys(position).length);

    let pinPos = null;

    if (inInitialLocation && !hasPosition) {
      pinPos = pinPosition;
    }
    if (hasPosition) {
      pinPos = position;
    }
    setNewPinPos(pinPos);
  }, [position, inInitialLocation, pinPosition]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <FormikProvider value={locationSearchFormik}>
        <Form className="flex min-h-[46px] w-full overflow-hidden rounded-full border border-gray-100 p-2 focus-within:shadow-md">
          <Field
            // value={searchQuery}
            name="location"
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none px-2 font-body text-[15px] placeholder-[#818181] outline-none focus:border-none focus:outline-none
            lg:px-4"
            placeholder="Search location"
          ></Field>
          <button
            className="flex aspect-square h-full flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white"
            type="submit"
          >
            <Search size={16} className="block" />
          </button>
        </Form>
      </FormikProvider>
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
