import { checkHasUnread } from "../controllers/message-controller";
import { getKeyByValue } from "../../utils/socket-utils";

export async function checkHasUnreadConvo(user, sockets, io) {
  try {
    const hasUnread = await checkHasUnread(user);
    const userSocketId = getKeyByValue(sockets, user);

    io.in(userSocketId).emit("has-unread", hasUnread);
  } catch (error) {
    console.log(error);
  }
}
