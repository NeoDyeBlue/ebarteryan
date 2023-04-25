import { checkHasUnreadConvo } from "../data-access/message";
import { countUnreadNotifications } from "../data-access/notification";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function checkHasUnreadConversation(user, sockets, io) {
  try {
    const hasUnread = await checkHasUnreadConvo(user);
    let sIds = getMultiKeysByValue(sockets, user);
    sIds.forEach((sId) => {
      io.in(sId).emit("conversation:has-unread", hasUnread);
    });
  } catch (error) {
    console.log(error);
  }
}

export async function checkHasUnreadNotification(user, sockets, io) {
  try {
    const unreadCount = await countUnreadNotifications(user);
    let sIds = getMultiKeysByValue(sockets, user);
    sIds.forEach((sId) => {
      io.in(sId).emit("notification:unread-count", unreadCount);
    });
  } catch (error) {
    console.log(error);
  }
}
