import Image from "next/image";

export default function ChatBubble({
  isFromUser,
  consecutive,
  type,
  userPic,
  content,
}) {
  //   const timestamp = new Date(props.createdAt);
  return (
    <li
      className={`relative my-3 flex max-w-[70%] items-end gap-2 ${
        isFromUser ? "flex-row-reverse self-end" : "self-start"
      } ${consecutive ? "mb-0 last:mb-4" : ""}`}
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
      <div
        className={`whitespace-pre-wrap break-all rounded-t-[10px] p-3 ${
          isFromUser
            ? "rounded-bl-[10px] bg-green-500 text-white"
            : "rounded-br-[10px] bg-gray-100"
        }`}
      >
        {type == "text" && <p>{content}</p>}
      </div>
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
