import Button from "./Button";
import LinkButton from "./LinkButton";
import { Pen, Location } from "@carbon/icons-react";
import Link from "next/link";
import LocationModal from "../Modals/LocationModal";
import ReactModal from "react-modal";
import { useState } from "react";
import useMapStore from "../../store/useMapStore";
import Marquee from "react-fast-marquee";

export default function LocationBarterButtons({ className }) {
  ReactModal.setAppElement("#__next");
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
      <ReactModal
        contentLabel="Location Modal"
        isOpen={locationModalOpen}
        // closeTimeoutMS={300}
        overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end`}
        preventScroll={true}
        onRequestClose={closeLocationModal}
        bodyOpenClassName="modal-open-body"
        className={`relative h-[90vh] w-full overflow-hidden rounded-t-[10px] bg-white
         py-6 shadow-lg md:m-auto md:max-w-[580px] md:rounded-[10px]`}
      >
        <div
          className={`custom-scrollbar container flex max-h-full min-h-full overflow-y-auto md:px-6`}
        >
          <LocationModal
            onClose={closeLocationModal}
            applyInListing={true}
            onApply={() => {
              setListingLocation();
              closeLocationModal();
            }}
          />
          {/* <OfferModal onClose={closeOfferModal} /> */}
        </div>
      </ReactModal>
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
