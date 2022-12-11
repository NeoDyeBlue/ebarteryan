import Button from "./Button";
import LinkButton from "./LinkButton";
import { Pen, Location } from "@carbon/icons-react";
import LocationModal from "../Modals/LocationModal";
import ReactModal from "react-modal";
import { useState, useRef } from "react";
import useMapStore from "../../store/useMapStore";
import Marquee from "react-fast-marquee";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

export default function LocationBarterButtons({ className }) {
  const modalRef = useRef(null);
  const {
    clearPositionRegion,
    listingRegion,
    listingRadius,
    setListingLocation,
  } = useMapStore();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  function openLocationModal() {
    disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    enableBodyScroll(modalRef?.current);
    clearPositionRegion();
    setLocationModalOpen(false);
  }
  return (
    <>
      <LocationModal
        ref={modalRef}
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
          <Pen size={20} /> Make a Barter
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
