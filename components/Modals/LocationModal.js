import dynamic from "next/dynamic";
const Map = dynamic(() => import("../Map/Map"), {
  ssr: false,
});
import { Add } from "@carbon/icons-react";
import { Button, CircleButton } from "../Buttons";
import useMapStore from "../../store/useMapStore";
import ReactModal from "react-modal";
import { useMemo, useEffect, useRef } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default function LocationModal({
  onClose,
  applyInListing=false,
  onApply,
  isOpen,
}) {
  ReactModal.setAppElement("#__next");
  const { region, listingPosition, creationPosition } = useMapStore();
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
    } else {
      enableBodyScroll(modalRef?.current);
    }
  }, [isOpen]);

  // check if there is a position set
  const initialPosition = useMemo(() => {
    const hasListingPosition = Boolean(
      listingPosition && Object.keys(listingPosition).length
    );
    const hasCreationPosition = Boolean(
      creationPosition && Object.keys(creationPosition).length
    );
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
  }, [listingPosition, creationPosition, applyInListing]);

  return (
    <ReactModal
      ref={modalRef}
      contentLabel="Location Modal"
      isOpen={isOpen}
      closeTimeoutMS={150}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end`}
      preventScroll={true}
      onRequestClose={onClose}
      // bodyOpenClassName="modal-open-body"
      className={`relative h-[90vh] w-full overflow-hidden rounded-t-[10px] bg-white
     py-6 shadow-lg md:m-auto md:max-w-[580px] md:rounded-[10px]`}
    >
      <div
        className={`custom-scrollbar container mx-auto flex max-h-full min-h-full overflow-y-auto md:px-6`}
      >
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
          <Button disabled={!region} onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </ReactModal>
  );
}
