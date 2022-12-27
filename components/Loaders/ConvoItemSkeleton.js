import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ConvoItemSkeleton() {
  return (
    <li
      className="before:bg-blue-100 relative flex cursor-pointer items-center gap-2 rounded-[10px] before:absolute
    before:left-1/2 before:-z-10 before:h-full before:w-[calc(100%+5%)]
    before:translate-x-[-50%] before:rounded-[10px] before:bg-transparent hover:before:bg-gray-100/30"
    >
      <div className="relative h-[48px] w-[48px] flex-shrink-0">
        {/* <Image
          src={photo}
          layout="fill"
          className="rounded-full"
          alt="user image"
        /> */}
        <span
          className="absolute right-0 z-10 h-[14px] w-[14px] 
        rounded-full border-[2px] border-white bg-green-400"
        ></span>
      </div>
      <div
        className="flex w-full flex-col overflow-hidden text-ellipsis 
      whitespace-nowrap py-3"
      >
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-display font-semibold">
          {sender}
        </p>
        <p
          className={` overflow-hidden text-ellipsis whitespace-nowrap text-sm ${
            unread ? "font-semibold text-black-light" : "text-gray-300"
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
