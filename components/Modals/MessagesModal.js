import BadgedIcon from "../Icons/BadgedIcon";
import { Chat } from "@carbon/icons-react";

export default function MessagesModal({ className, hasBadge }) {
  function clickHandler() {
    console.log("clicked");
  }

  return (
    <div className={className}>
      <div
        className="container mx-auto flex justify-end"
        onClick={clickHandler}
      >
        <div
          className="bg-white rounded-t-[10px] px-4 py-3 pointer-events-auto cursor-pointer 
        text-black-light font-display font-medium flex items-center gap-3 shadow-lg relative
        border border-b-0 border-gray-100
        "
        >
          {/* {hasBadge && (
            <span className="absolute rounded-full bg-red text-center top-[-15%] right-[5%] w-[14px] h-[14px] border-white border-2"></span>
          )} */}
          <BadgedIcon hasBadge={true}>
            <Chat size={24} />
          </BadgedIcon>
          <p>Messages</p>
        </div>
      </div>
    </div>
  );
}
