import Image from "next/image";

export default function NotificationListItem({ unread }) {
  return (
    <li
      className={`relative flex cursor-pointer items-start gap-3 py-2 before:absolute
    before:left-1/2 before:top-0 before:-z-10 before:h-full before:w-[calc(100%+5%)]
    before:translate-x-[-50%] before:rounded-[10px]
    ${
      unread
        ? "before:bg-green-200"
        : "before:bg-transparent hover:before:bg-gray-100/30"
    }`}
    >
      <div className="relative h-[48px] w-[48px] flex-shrink-0 rounded-full bg-gray-100"></div>
      <div>
        <p>
          <span className="font-semibold">From User</span> offers an item for
          your <span>Item Name</span>
        </p>
        <p
          className={`text-sm ${unread ? "text-black-light" : "text-gray-200"}`}
        >
          2h ago
        </p>
      </div>
    </li>
  );
}
