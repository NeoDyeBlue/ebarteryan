import { Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import { ReviewForm } from "../Forms";
import ReactModal from "react-modal";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEffect, useRef } from "react";

export default function ReviewModal({ onClose, isOpen }) {
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
      contentLabel="Offer Modal"
      isOpen={isOpen}
      closeTimeoutMS={150}
      // closeTimeoutMS={300}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end`}
      preventScroll={true}
      onRequestClose={onClose}
      // bodyOpenClassName="modal-open-body"
      className={`relative w-full overflow-hidden rounded-t-[10px] bg-white
     py-6 shadow-lg md:m-auto md:max-w-[480px] md:rounded-[10px]`}
    >
      <div className={`custom-scrollbar container overflow-y-auto md:px-6`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="text-2xl font-semibold">Create Review</h1>
            <CircleButton
              onClick={onClose}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          <ReviewForm onClose={() => onClose()} />
        </div>
      </div>
    </ReactModal>
  );
}
