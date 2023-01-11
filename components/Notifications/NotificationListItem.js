import Image from "next/image";
import { useRouter } from "next/router";
import format from "date-fns/format";
import { useState } from "react";
import { useEffect } from "react";
import useSocketStore from "../../store/useSocketStore";
import useNotificationStore from "../../store/useNotificationStore";

export default function NotificationListItem({ read, type, data }) {
  const router = useRouter();
  let message = "";
  let image = "";
  let url = "";

  const { socket } = useSocketStore();
  const { setUnreadCount } = useNotificationStore();

  const [isRead, setIsRead] = useState(read);

  useEffect(() => setIsRead(read), [read]);

  switch (type) {
    case "question":
      message = "asked a question about your item";
      image = data?.question?.user?.image?.url;
      break;
    case "answer":
      message = "answered your question on item";
      image = data?.item?.user?.image?.url;
      break;
    case "offer":
      message = "offered on your item";
      image = data?.offer?.user?.image?.url;
      break;
    case "offer-accepted":
      message = "accepted your offer on item";
      image = data?.item?.user?.image?.url;
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
      setUnreadCount(result.data.unreadNotifications);
    }
    router.push(`/items/${data?.item?._id}`);
  }

  return (
    <li
      onClick={handleNotificationClicked}
      className={`relative flex cursor-pointer items-start gap-3 rounded-[10px] p-2
    ${isRead ? "hover:bg-gray-100/30" : "bg-green-200"}`}
    >
      <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
        <Image src={image} layout="fill" alt="notif image" />
      </div>
      <div className="max-h-full overflow-hidden">
        <p className="overflow-ellipsis">
          <span className="font-semibold">
            {type == "question" && data?.question?.user?.fullName}
            {type == "answer" && data?.item?.user?.fullName}
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
