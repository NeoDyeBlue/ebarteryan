import { Add } from "@carbon/icons-react";
import ReactModal from "react-modal";
import { useRef } from "react";
import { CircleButton } from "../Buttons";

export default function Modal({ onClose, isOpen, label, children }) {
  ReactModal.setAppElement("#__next");
  const modalRef = useRef();
  return (
    <ReactModal
      ref={modalRef}
      // contentLabel="Offer Modal"
      isOpen={isOpen}
      overlayClassName="bg-black/20 fixed top-0 z-50 flex h-full w-full items-end md:p-6 overflow-y-auto"
      preventScroll={true}
      onRequestClose={onClose}
      closeTimeoutMS={150}
      // bodyOpenClassName="modal-open-body"
      className="relative w-full overflow-hidden rounded-t-lg bg-white
     py-6 shadow-lg outline-none md:m-auto md:max-w-[480px] md:rounded-lg"
    >
      <div className="custom-scrollbar mx-auto max-h-[70vh] overflow-y-auto px-6 md:max-h-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="font-display text-2xl font-semibold">{label}</h1>
            <CircleButton
              onClick={onClose}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          {children}
        </div>
      </div>
    </ReactModal>
  );
}
