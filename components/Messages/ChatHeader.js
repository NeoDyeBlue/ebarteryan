import { ArrowLeft, Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import Image from "next/image";
import useMessagesStore from "../../store/useMessagesStore";
import { useSession } from "next-auth/react";
import useUserOnlineCheck from "../../lib/hooks/useUserOnlineCheck";

export default function ChatHeader({ showClose = false, onClose }) {
  const { conversation, setIsPageConversationOpen } = useMessagesStore();
  const { data: session } = useSession();

  const recipient = conversation?.members?.find(
    (member) => member.user._id !== (session && session.user.id)
  );

  const isOnline = useUserOnlineCheck(
    session && session.user.id,
    recipient.user._id
  );

  return (
    <div
      className={`container mx-auto flex items-center gap-4 py-3 md:mx-0 md:px-4 ${
        showClose ? "justify-between" : ""
      }`}
    >
      {!showClose && (
        <div className="md:hidden">
          <CircleButton
            onClick={() => setIsPageConversationOpen(false)}
            icon={<ArrowLeft size={24} />}
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="relative h-[36px] w-[36px] flex-shrink-0">
          <Image
            src={recipient?.user?.image?.url}
            layout="fill"
            className="rounded-full"
            alt="user image"
          />
          {isOnline && (
            <span
              className="absolute right-0 bottom-0 z-10 h-[14px] w-[14px] 
    rounded-full border-[2px] border-white bg-green-400"
            ></span>
          )}
        </div>
        <p className="font-display font-medium">
          {recipient?.user?.fullName ||
            `${recipient?.user?.firstName} ${recipient?.user?.lastName}`}
        </p>
      </div>
      {showClose && (
        <CircleButton
          icon={<Add size={32} className="rotate-[135deg]" onClick={onClose} />}
        />
      )}
    </div>
  );
}
