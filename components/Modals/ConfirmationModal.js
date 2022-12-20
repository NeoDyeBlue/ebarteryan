import { Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import ReactModal from "react-modal";
import { Button } from "../Buttons";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
// import { enableScroll, disableScroll } from "../../utils/scroll-utils";
import useScrollBlock from "../../lib/hooks/useScrollBlock";
import { useRef, useEffect } from "react";

export default function ConfirmationModal({
  onClose,
  isOpen,
  label,
  message,
  onConfirm,
  onCancel,
}) {
  ReactModal.setAppElement("#__next");
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
      // disableScroll();
      // blockScroll();
    } else {
      enableBodyScroll(modalRef?.current);
      // enableScroll();
      // allowScroll();
    }
  }, [isOpen]);

  return (
    <ReactModal
      ref={modalRef}
      contentLabel="Offer Modal"
      isOpen={isOpen}
      // closeTimeoutMS={300}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full p-4`}
      preventScroll={true}
      onRequestClose={() => {
        onCancel && onCancel();
        onClose();
      }}
      // htmlOpenClassName="overflow-y-scroll fixed w-full"
      // bodyOpenClassName="h-full overflow-y-scroll fixed w-full"
      className={`relative m-auto w-full overflow-hidden rounded-[10px]
     bg-white py-6 shadow-lg md:max-w-[480px]`}
    >
      <div
        className={`custom-scrollbar container max-h-full overflow-y-auto md:px-6`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-shrink-0 items-center justify-between">
            <h1 className="text-2xl font-semibold">{label}</h1>
            <CircleButton
              onClick={() => {
                onCancel && onCancel();
                onClose();
              }}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          <p>{message}</p>
          <div className="flex flex-row-reverse items-center justify-between gap-4">
            <Button
              autoWidth={true}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </Button>
            <Button
              autoWidth={true}
              secondary={true}
              onClick={() => {
                onCancel && onCancel();
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
