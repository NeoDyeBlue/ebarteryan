import { Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import ReactModal from "react-modal";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useEffect, useRef, useState } from "react";

export default function WelcomePopup() {
  ReactModal.setAppElement("#__next");
  const modalRef = useRef();

  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (showPopup) {
      disableBodyScroll(modalRef?.current, { reserveScrollBarGap: true });
    } else {
      enableBodyScroll(modalRef?.current);
    }
  }, [showPopup]);

  useEffect(() => {
    const hasShownPopup = localStorage.getItem("hasShownPopup");
    if (hasShownPopup) {
      setShowPopup(false);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("hasShownPopup", true);
  };

  return (
    <ReactModal
      ref={modalRef}
      contentLabel="Welcome Popup"
      isOpen={showPopup}
      overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end p-6`}
      preventScroll={true}
      onRequestClose={handleClosePopup}
      closeTimeoutMS={150}
      // bodyOpenClassName="modal-open-body"
      className={`relative m-auto flex aspect-square max-h-[480px] w-full max-w-[480px]
     rounded-full bg-white p-6 shadow-lg outline-none`}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-opacity-25 bg-[url('/ebarteryan.svg')] bg-cover opacity-20"></div>
      <div className={`container mx-auto min-h-full md:px-6`}>
        <div className="flex h-full flex-col">
          <div className="absolute top-0 right-[10%] flex flex-shrink-0 items-center justify-end rounded-full bg-white">
            <CircleButton
              onClick={handleClosePopup}
              icon={<Add className="rotate-[135deg]" size={32} />}
            />
          </div>
          <div className="flex min-h-full flex-col items-center justify-center gap-4 text-center">
            <p className="font-display text-4xl font-bold text-green-500">
              Welcome!
            </p>
            {/* <p className="font-display text-lg font-medium">Hi There!</p> */}
            <p className="font-display text-lg font-semibold">
              This is EbarterYan a bartering place for your community!{" "}
            </p>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
