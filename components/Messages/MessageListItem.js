import Image from "next/image";

export default function MessageListItem({
  photo,
  subtitle,
  sender,
  unread,
  time,
  count,
}) {
  return (
    <li
      className="relative flex items-center gap-2 rounded-[10px] py-2 before:absolute before:left-1/2 before:-z-10
    before:h-full before:w-[calc(100%+5%)] before:translate-x-[-50%] before:rounded-[10px]
    before:bg-blue-100 before:bg-transparent hover:before:bg-gray-100/30"
    >
      <div className="relative h-[56px] w-[56px] flex-shrink-0">
        <Image src={photo} layout="fill" className="rounded-full" />
        <span
          className="absolute right-0 z-10 h-[16px] w-[16px] 
        rounded-full border-[2px] border-white bg-green-400"
        ></span>
      </div>
      <div className="flex w-full flex-col gap-1">
        <p className="overflow-hidden text-ellipsis font-display font-semibold">
          {sender}
        </p>
        <p
          className={`text-sm ${
            unread ? "font-semibold text-black-light" : "text-gray-300"
          }`}
        >
          {subtitle}
        </p>
      </div>
      {unread && (
        <span className="h-[16px] w-[16px] flex-shrink-0 rounded-full bg-blue-500"></span>
      )}
    </li>
  );
}
