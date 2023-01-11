import { checkHasUnreadConvo } from "../controllers/message-controller";
import { checkHasUnreadNotif } from "../controllers/notification-controller";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function checkHasUnreadConversation(user, sockets, io) {
  try {
    const hasUnread = await checkHasUnreadConvo(user);
    let sIds = getMultiKeysByValue(sockets, user);
    sIds.forEach((sId) => {
      io.in(sId).emit("has-unread-convo", hasUnread);
    });
  } catch (error) {
    console.log(error);
  }
}

export async function checkHasUnreadNotification(user, sockets, io) {
  try {
    const unreadCount = await checkHasUnreadNotif(user);
    let sIds = getMultiKeysByValue(sockets, user);
    sIds.forEach((sId) => {
      io.in(sId).emit("has-unread-notif", unreadCount);
    });
  } catch (error) {
    console.log(error);
  }
}
