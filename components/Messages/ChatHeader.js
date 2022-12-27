import { ArrowLeft, Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import Image from "next/image";
import useMessagesStore from "../../store/useMessagesStore";
import { useSession } from "next-auth/react";

export default function ChatHeader({ showClose, onClose }) {
  const { conversation } = useMessagesStore();
  const { data: session } = useSession();

  const receiver = conversation?.members?.find(
    (member) => member._id !== (session && session.user.id)
  );
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
            src={receiver?.image?.url}
            layout="fill"
            className="rounded-full"
            alt="user image"
          />
          <span
            className="absolute right-0 z-10 h-[12px] w-[12px] 
    rounded-full border-[2px] border-white bg-green-400"
          ></span>
        </div>
        <p className="font-display font-medium">{receiver?.fullName}</p>
      </div>
      {showClose && (
        <CircleButton
          icon={<Add size={32} className="rotate-[135deg]" onClick={onClose} />}
        />
      )}
    </div>
  );
}
