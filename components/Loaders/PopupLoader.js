import { BarLoader } from "react-spinners";
import ReactModal from "react-modal";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { useEffect, useRef } from "react";

export default function PopupLoader({ message, isOpen }) {
  ReactModal.setAppElement("#__next");
  const modalRef = useRef();
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
    } else {
      enableBodyScroll(modalRef?.current);
    }
  }, [isOpen]);
  return (
    <ReactModal
      ref={modalRef}
      contentLabel="Location Modal"
      isOpen={isOpen}
      closeTimeoutMS={150}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full p-4`}
      preventScroll={true}
      // bodyOpenClassName="modal-open-body"
      className={`relative m-auto w-full overflow-hidden rounded-[10px]
     bg-white py-6 shadow-lg outline-none md:max-w-[580px]`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center">{message}</p>
        <BarLoader
          color="#85CB33"
          size={14}
          width={200}
          className="flex h-[22.5px] w-full items-center justify-center"
        />
      </div>
    </ReactModal>
  );
}
