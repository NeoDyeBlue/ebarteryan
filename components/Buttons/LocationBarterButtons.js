import Button from "./Button";
import LinkButton from "./LinkButton";
import { Pen, Location, AddAlt } from "@carbon/icons-react";
import LocationModal from "../Modals/LocationModal";
import { useState } from "react";
import useMapStore from "../../store/useMapStore";
import Marquee from "react-fast-marquee";

export default function LocationBarterButtons({ className }) {
  const {
    clearPositionRegion,
    listingRegion,
    listingRadius,
    setListingLocation,
  } = useMapStore();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  function openLocationModal() {
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    clearPositionRegion();
    setLocationModalOpen(false);
  }
  return (
    <>
      <LocationModal
        onClose={closeLocationModal}
        applyInListing={true}
        isOpen={locationModalOpen}
        onApply={() => {
          setListingLocation();
          closeLocationModal();
        }}
      />
      <div
        className={
          className
            ? className
            : "container mx-auto flex w-full flex-col gap-4 p-[1.5rem] lg:hidden"
        }
      >
        <LinkButton link="/create">
          <AddAlt size={20} /> Make a Barter
        </LinkButton>
        <Button underlined="true" onClick={openLocationModal}>
          <Location size={20} />
          {listingRegion ? (
            <Marquee gradientWidth={8}>
              <p className="px-2">
                {listingRegion} - {listingRadius}km
              </p>
            </Marquee>
          ) : (
            "Choose Location"
          )}
        </Button>
      </div>
    </>
  );
}
