import Image from "next/image";
import useMessagesStore from "../../store/useMessagesStore";
import { useSession } from "next-auth/react";
import useUserOnlineCheck from "../../lib/hooks/useUserOnlineCheck";
import { useState, useEffect } from "react";

export default function MessageListItem({
  convoId,
  image,
  subtitle,
  recipient,
  onClick,
  read = false,
}) {
  const [isRead, setIsRead] = useState(false);
  const { conversation } = useMessagesStore();
  const { data: session } = useSession();

  useEffect(() => {
    setIsRead(read);
  }, [read]);

  const isOnline = useUserOnlineCheck(
    session && session.user.id,
    recipient?.user?._id
  );

  function handleClick() {
    if (!isRead) {
      setIsRead(true);
    }
    onClick();
  }

  return (
    <li
      onClick={handleClick}
      className={`group relative flex cursor-pointer items-center gap-2 overflow-hidden 
      rounded-[10px] px-2 py-0  ${
        convoId == conversation?._id
          ? "lg:bg-gray-100/30"
          : "hover:bg-gray-100/30"
      }`}
    >
      <div className="relative h-[48px] w-[48px] flex-shrink-0">
        <Image
          src={image}
          layout="fill"
          className="rounded-full"
          alt="user image"
        />
        {isOnline && (
          <span
            className={`absolute right-0 bottom-0 z-10 h-[14px] w-[14px] rounded-full 
        border-[2px] border-white bg-green-400
        ${
          convoId == conversation?._id
            ? "border-[#f1f1f1]"
            : "group-hover:border-[#f1f1f1]"
        }`}
          ></span>
        )}
      </div>
      <div
        className="flex w-full flex-col overflow-hidden text-ellipsis 
      whitespace-nowrap py-3"
      >
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-display font-semibold">
          {recipient?.user?.fullName}
        </p>
        <p
          className={` overflow-hidden text-ellipsis whitespace-nowrap text-sm ${
            isRead ? "text-gray-300 " : "font-semibold text-black-light"
          }`}
        >
          {subtitle}
        </p>
      </div>
      {/* {unread && (
        <span className="h-[14px] w-[14px] flex-shrink-0 rounded-full bg-blue-500"></span>
      )} */}
    </li>
  );
}
