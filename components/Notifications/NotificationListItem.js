import Image from "next/image";
import { useRouter } from "next/router";
import format from "date-fns/format";
import { useState, useEffect } from "react";
import useSocketStore from "../../store/useSocketStore";
import useNotificationStore from "../../store/useNotificationStore";

export default function NotificationListItem({ read, type, data }) {
  const router = useRouter();
  let message = "";
  const userCount = data?.users?.length || 0;
  const image = data?.users[userCount - 1]?.image?.url;

  const { setUnreadCount } = useNotificationStore();

  const [isRead, setIsRead] = useState(read);

  useEffect(() => setIsRead(read), [read]);

  switch (type) {
    case "question":
      message = `${
        userCount > 1
          ? `and ${userCount - 1} other${userCount > 2 ? "s" : ""}`
          : ""
      } asked a question about your item`;
      break;
    case "answer":
      message = "answered your question on item";
      break;
    case "offer":
      message = `${
        userCount > 1
          ? `and ${userCount - 1} other${userCount > 2 ? "s" : ""}`
          : ""
      } offered on your item`;
      break;
    case "offer-accepted":
      message = "accepted your offer on item";
      break;
    case "review":
      message = `wrote you a review for your item`;
      break;
    case "item-ended":
      message = "accepts an offer on item";
      break;
  }

  async function handleNotificationClicked() {
    setIsRead(true);
    const res = await fetch(`/api/notifications/${data?._id}`, {
      method: "PATCH",
    });
    const result = await res.json();
    if (result && result.success) {
      console.log(result);
      setUnreadCount(result.data.unreadNotifications);
    }
    if (type == "review") {
      router.push(`/profile`);
    } else {
      router.push(`/items/${data?.item?._id}#offers-questions`);
    }
  }

  return (
    <li
      onClick={handleNotificationClicked}
      className={`relative flex cursor-pointer items-start gap-3 rounded-[10px] p-2
    ${isRead ? "hover:bg-gray-100/30" : "bg-green-200/50"}`}
    >
      <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
        <Image src={image} layout="fill" objectFit="cover" alt="notif image" />
      </div>
      <div className="max-h-full overflow-hidden">
        <p className="overflow-ellipsis">
          <span className="font-semibold">
            {data?.users[userCount - 1]?.fullName}
          </span>{" "}
          {message} <span className="font-semibold">{data?.item?.name}</span>
        </p>
        <p
          className={`mt-1 text-xs ${
            isRead ? "text-gray-200" : "text-black-light"
          }`}
        >
          {data?.updatedAt && format(new Date(data?.updatedAt), "PPp")}
        </p>
      </div>
    </li>
  );
}
