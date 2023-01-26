import BadgedIcon from "../Icons/BadgedIcon";
import {
  Notification,
  Bookmark,
  ArrowsHorizontal,
  Chat,
  Home,
} from "@carbon/icons-react";
import IconLink from "./IconLink";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useNotificationStore from "../../store/useNotificationStore";
import useSocketStore from "../../store/useSocketStore";
import { toast } from "react-hot-toast";

export default function MobileNavbar({ className }) {
  const [hasUnread, setHasUnread] = useState(false);
  const { data: session, status } = useSession();
  const { unreadCount } = useNotificationStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (socket) {
      socket.emit("conversation:check-has-unread", session && session.user.id);

      socket.on("conversation:has-unread", (hasUnread) => {
        setHasUnread(hasUnread);
      });
    }
  }, [socket, session]);

  return (
    <nav className={className}>
      <ul className="container mx-auto flex w-full items-center justify-between">
        <li
          className={`${
            session && status == "authenticated" && session.user?.verified
              ? ""
              : "mx-auto"
          }`}
        >
          <IconLink to="/" aka={["/items"]}>
            <Home size={24} />
          </IconLink>
        </li>
        {session && status == "authenticated" && session.user?.verified && (
          <>
            <li>
              <IconLink to="/offers">
                <BadgedIcon hasBadge={false}>
                  <ArrowsHorizontal size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/saved">
                <BadgedIcon hasBadge={false}>
                  <Bookmark size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/notifications">
                <BadgedIcon hasBadge={unreadCount > 0} count={unreadCount}>
                  <Notification size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/messages">
                <BadgedIcon hasBadge={hasUnread}>
                  <Chat size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
