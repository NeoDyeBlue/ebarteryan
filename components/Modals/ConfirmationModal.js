import { Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import ReactModal from "react-modal";
import { Button } from "../Buttons";

export default function ConfirmationModal({
  onClose,
  isOpen,
  label,
  message,
  onConfirm,
  onCancel,
}) {
  ReactModal.setAppElement("#__next");
  return (
    <ReactModal
      contentLabel="Offer Modal"
      isOpen={isOpen}
      // closeTimeoutMS={300}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full p-4`}
      preventScroll={true}
      onRequestClose={() => {
        onCancel();
        onClose();
      }}
      bodyOpenClassName="modal-open-body"
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
                onCancel();
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
                onCancel();
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
