import { NotificationTabs } from "../Notifications";
import Link from "next/link";

export default function NotificationsPopup() {
  return (
    <div
      className="custom-scrollbar absolute top-[calc(100%+0.5rem)] right-[-235%] z-50 h-[80vh] w-[360px]
      overflow-y-auto overflow-x-hidden rounded-[10px] border border-gray-100 bg-white py-4 shadow-lg"
    >
      <div className="flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Notifications</h1>
        <Link href="/notifications">
          <a
            className="rounded-[10px] px-2 py-1 font-display text-green-500
            hover:bg-gray-100/30"
          >
            See All
          </a>
        </Link>
      </div>
      <NotificationTabs />
    </div>
  );
}
