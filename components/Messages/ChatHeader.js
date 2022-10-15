import { ArrowLeft, Add } from "@carbon/icons-react";
import CircleButton from "../CircleButton";
import Image from "next/image";

export default function ChatHeader({ showClose, onClose }) {
  return (
    <div
      className={`flex items-center gap-4 py-3 ${
        showClose ? "justify-between" : ""
      }`}
    >
      {!showClose && (
        <button>
          <ArrowLeft size={24} />
        </button>
      )}
      <div className="flex items-center gap-3">
        <div className="relative h-[36px] w-[36px] flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
            layout="fill"
            className="rounded-full"
          />
          <span
            className="absolute right-0 z-10 h-[12px] w-[12px] 
    rounded-full border-[2px] border-white bg-green-400"
          ></span>
        </div>
        <p className="font-display font-medium">Other User</p>
      </div>
      {showClose && (
        <CircleButton
          icon={<Add size={32} className="rotate-[135deg]" onClick={onClose} />}
        />
      )}
    </div>
  );
}
