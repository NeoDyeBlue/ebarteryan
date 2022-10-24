import dynamic from "next/dynamic";
const Map = dynamic(() => import("../Map/Map"), {
  ssr: false,
});
import { Add } from "@carbon/icons-react";
import { Button, CircleButton } from "../Buttons";
import useMapStore from "../../store/useMapStore";
import { useMemo } from "react";

export default function LocationModal({ onClose, applyInListing }) {
  const {
    region,
    listingPosition,
    setListingLocation,
    setCreationLocation,
    creationPosition,
  } = useMapStore();

  // check if there is a position set
  const initialPosition = useMemo(() => {
    const hasListingPosition = Boolean(Object.keys(listingPosition).length);
    const hasCreationPosition = Boolean(Object.keys(creationPosition).length);
    if (applyInListing) {
      return hasListingPosition ? listingPosition : null;
    } else if (!applyInListing) {
      if (hasCreationPosition) {
        return creationPosition;
      } else if (!hasCreationPosition && hasListingPosition) {
        return listingPosition;
      } else {
        return null;
      }
    }
  }, [listingPosition, creationPosition]);

  return (
    <div
      className="flex max-h-full min-h-full w-full flex-shrink-0 flex-col
    gap-4 rounded-[10px]"
    >
      <div className="flex flex-shrink-0 items-center justify-between">
        <h1 className="text-2xl font-semibold">Change Location</h1>
        <CircleButton
          onClick={onClose}
          icon={<Add className="rotate-[135deg]" size={32} />}
        />
      </div>
      <hr className="border-gray-100" />
      <Map
        withRadiusPicker={applyInListing ? true : false}
        center={initialPosition}
        pinPosition={initialPosition}
      />
      <Button
        disabled={!region}
        onClick={() => {
          if (applyInListing) {
            setListingLocation();
          } else {
            setCreationLocation();
          }
          onClose();
        }}
      >
        Apply
      </Button>
    </div>
  );
}
