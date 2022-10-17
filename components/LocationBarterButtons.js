import Button from "./Button";
import { Pen, Location } from "@carbon/icons-react";
import Link from "next/link";
import LocationModal from "./Modals/LocationModal";
import ReactModal from "react-modal";
import { useState } from "react";

export default function LocationBarterButtons({ className }) {
  ReactModal.setAppElement("#__next");
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  function openLocationModal() {
    console.log("t");
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
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
         py-6 shadow-lg md:m-auto md:max-w-[480px] md:rounded-[10px]`}
      >
        <div
          className={`custom-scrollbar container max-h-full min-h-full overflow-y-auto md:px-6`}
        >
          <LocationModal />
          {/* <OfferModal onClose={closeOfferModal} /> */}
        </div>
      </ReactModal>
      <div
        className={
          className
            ? className
            : "container mx-auto flex w-full flex-col gap-4 p-4 lg:hidden"
        }
      >
        <Link href="/create">
          <a
            className="flex w-full items-center justify-center gap-1 text-ellipsis whitespace-nowrap 
        rounded-[10px] bg-green-500 px-4 py-3 text-center font-display text-[15px] font-medium text-white"
          >
            <Pen size={20} /> Make a Barter
          </a>
        </Link>
        <Button underlined="true" onClick={openLocationModal}>
          <Location size={20} /> Pandi, Bulacan
        </Button>
      </div>
    </>
  );
}
