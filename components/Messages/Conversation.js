import { Add, Send, Image as ImageIcon } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import Image from "next/image";

export default function Conversation({ onClose }) {
  return (
    <div className="grid h-full max-h-full w-full grid-cols-1 grid-rows-[auto_1fr_auto] overflow-hidden">
      {/* header */}
      <div className="container mx-auto flex items-center justify-between gap-4 border-b border-gray-100 py-3 md:px-4">
        <div className="flex items-center gap-3">
          <div className="relative h-[36px] w-[36px] flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
              layout="fill"
              className="rounded-full"
              alt="user image"
            />
            <span
              className="absolute right-0 z-10 h-[12px] w-[12px] 
    rounded-full border-[2px] border-white bg-green-400"
            ></span>
          </div>
          <p className="font-display font-medium">Other User</p>
        </div>
        <div className="md:hidden">
          <CircleButton
            icon={
              <Add size={32} className="rotate-[135deg]" onClick={onClose} />
            }
          />
        </div>
      </div>
      {/* convo */}
      <ul className="container mx-auto flex h-full w-full flex-col md:px-4"></ul>
      {/* input */}
      <div className="container mx-auto flex items-end gap-3 border-t border-gray-100 py-3 md:px-4">
        <button className="h-[40px] text-green-500">
          <ImageIcon size={32} />
        </button>
        <div
          className="max-h-[100px] w-full overflow-y-auto break-all rounded-[10px] bg-gray-100/50 bg-white
        px-3 py-2 font-body placeholder-gray-100 focus:outline-none"
          contentEditable="true"
          suppressContentEditableWarning="true"
          role="textbox"
          placeholder="Enter message here"
        ></div>
        <button className="h-[40px] text-green-500">
          <Send size={32} />
        </button>
      </div>
    </div>
  );
}
