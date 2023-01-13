import InfiniteScroll from "react-infinite-scroll-component";
import NotificationListItem from "./NotificationListItem";
import { NotifItemSkeleton } from "../Loaders";
import usePaginate from "../../lib/hooks/usePaginate";
import useNotificationStore from "../../store/useNotificationStore";
import { useState, useEffect } from "react";
import useSocketStore from "../../store/useSocketStore";
import { useSession } from "next-auth/react";

export default function NotificationList({ unread, scrollableTargetId }) {
  const { data: session } = useSession();
  const { notificationList, setNotificationList, setUnreadCount } =
    useNotificationStore();
  const { socket } = useSocketStore();
  const {
    data: notifications,
    isLoading,
    isEndReached,
    setSize,
    size,
  } = usePaginate("/api/notifications", 5);

  useEffect(() => {
    if (notifications || notifications.length) {
      setNotificationList(notifications);
    }
  }, [notifications, setNotificationList]);

  useEffect(() => {
    if (socket) {
      socket.on("notification", (data) => {
        console.log(data);
        setNotificationList([data.notification, ...notificationList.filter(notif => notif._id !== data.notification._id)]);
        setUnreadCount(data.unreadNotifications);
      });

      socket.on("has-unread-notif", (count) => {
        setUnreadCount(count);
      });

      socket.emit("check-has-unread-notif", session && session.user?.id);

      return () => {
        socket.off("notification");
        socket.off("has-unread-notif");
      };
    }
  }, [socket, setNotificationList, setUnreadCount, notificationList, session]);

  const notificationItems =
    notificationList.length &&
    notificationList.map((notification) => (
      <NotificationListItem
        key={notification._id}
        read={notification.read}
        type={notification.type}
        data={notification}
      />
    ));

  return (
    <ul className="flex flex-col gap-2 py-4 px-2">
      <InfiniteScroll
        dataLength={notificationList.length}
        next={() => setSize(size + 1)}
        hasMore={!isEndReached}
        scrollableTarget={scrollableTargetId}
        className="flex flex-col gap-2"
        loader={[...Array(10)].map((_, i) => (
          <NotifItemSkeleton key={i} />
        ))}
      >
        {notificationItems.length ? (
          notificationItems
        ) : !isLoading ? (
          <li className="flex items-center justify-center text-center text-gray-200">
            No Notifications
          </li>
        ) : null}
      </InfiniteScroll>
    </ul>
  );
}
