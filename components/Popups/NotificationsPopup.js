import NotificationTabs from "../Notifications/NotificationTabs";

export default function NotificationPopup() {
  return (
    <div
      className="custom-scrollbar absolute top-[calc(100%+1rem)] right-[-415%] z-50 h-[80vh] w-[360px]
      overflow-y-auto overflow-x-hidden rounded-[10px] border border-gray-100 bg-white p-4 shadow-lg"
    >
      <NotificationTabs showAllLink="/notifications" />
    </div>
  );
}
