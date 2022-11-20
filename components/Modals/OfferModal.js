import { Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import { OfferForm } from "../Forms";
import ReactModal from "react-modal";

export default function OfferModal({ onClose, isOpen }) {
  ReactModal.setAppElement("#__next");
  return (
    <ReactModal
      contentLabel="Offer Modal"
      isOpen={isOpen}
      // closeTimeoutMS={300}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end`}
      preventScroll={true}
      onRequestClose={onClose}
      bodyOpenClassName="modal-open-body"
      className={`relative h-[70vh] w-full overflow-hidden rounded-t-[10px] bg-white
     py-6 shadow-lg md:m-auto md:h-[90vh] md:max-w-[480px] md:rounded-[10px]`}
    >
      <div
        className={`custom-scrollbar container max-h-full overflow-y-auto md:px-6`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="text-2xl font-semibold">Create an Offer</h1>
            <CircleButton
              onClick={onClose}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          <OfferForm onClose={() => onClose()} />
        </div>
      </div>
    </ReactModal>
  );
}
