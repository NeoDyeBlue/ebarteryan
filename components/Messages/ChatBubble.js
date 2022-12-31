import Image from "next/image";
import Link from "next/link";

export default function ChatBubble({
  isFromUser,
  consecutive,
  type,
  userPic,
  images,
  offer,
  text,
}) {
  //   const timestamp = new Date(props.createdAt);
  return (
    <li
      className={`relative flex max-w-[70%] items-end gap-2 ${
        isFromUser ? "flex-row-reverse self-end" : "self-start"
      } ${consecutive ? "mb-1" : "mb-4"}`}
    >
      {!isFromUser && (
        <div className="relative h-[24px] w-[24px] shrink-0 overflow-hidden rounded-full">
          {!consecutive ? (
            <Image
              src={userPic}
              objectFit="cover"
              alt="user pic"
              layout="fill"
            />
          ) : (
            <div className="h-[24px] w-[24px]"></div>
          )}
        </div>
      )}
      {/* <div
        className={`whitespace-pre-wrap break-all rounded-t-[10px] p-3 ${
          isFromUser
            ? "rounded-bl-[10px] bg-green-500 text-white"
            : "rounded-br-[10px] bg-gray-100"
        }`}
      >
        {type == "text" && <p>{content}</p>}
      </div> */}
      {type == "text" && (
        <div
          className={`whitespace-pre-wrap break-all rounded-t-[10px] p-3 ${
            isFromUser
              ? "rounded-bl-[10px] bg-green-500 text-white"
              : "rounded-br-[10px] bg-gray-100/30"
          }`}
        >
          <p>{text}</p>
        </div>
      )}
      {type == "offer" && offer && (
        <div
          className={`flex flex-col overflow-hidden whitespace-pre-wrap break-all rounded-t-[10px] ${
            isFromUser
              ? "rounded-bl-[10px] bg-green-500 text-white"
              : "rounded-br-[10px] bg-gray-100/30"
          }`}
        >
          <Link href={`/items/${offer?.item}`}>
            <a className="relative h-[120px] w-full">
              <Image
                src={offer?.images[0]?.url}
                objectFit="cover"
                alt="offer image"
                layout="fill"
              />
            </a>
          </Link>
          <p className="p-3">{text}</p>
        </div>
      )}
      {/* <div
        className={`${styles["c-chat__timestamp-wrap"]} ${
          props.isFromUser ? styles["c-chat__timestamp-wrap--right"] : ""
        }`}
      >
        <p className={styles["c-chat__timestamp"]}>
          {props.createdAt && timestamp.toLocaleDateString()}
        </p>
        <p className={styles["c-chat__timestamp"]}>
          {props.createdAt && timestamp.toLocaleTimeString()}
        </p>
      </div> */}
    </li>
  );
}
