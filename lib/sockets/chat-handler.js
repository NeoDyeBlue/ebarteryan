import { createChat, updateConvoRead } from "../controllers/message-controller";
import { getKeyByValue, getMultiKeysByValue } from "../../utils/socket-utils";

export async function sendChat(chat, socket, sockets, io) {
  try {
    const newChat = await createChat(
      chat?.sender,
      chat?.conversation,
      chat?.images,
      chat?.body
    );

    socket.to(chat?.conversation).emit("message-receive", newChat);

    const userStates = {
      sender: {
        id: chat.sender,
        inRoom: false,
      },
      receiver: {
        id: chat.receiver,
        inRoom: false,
      },
    };

    const senderSocketId = getKeyByValue(sockets, chat.sender);
    const receiverSocketId = getKeyByValue(sockets, chat.receiver);

    userStates.sender.inRoom =
      io.sockets.sockets.get(senderSocketId) &&
      io.sockets.sockets.get(senderSocketId).rooms.has(chat.conversation)
        ? true
        : false;

    userStates.receiver.inRoom =
      io.sockets.sockets.get(receiverSocketId) &&
      io.sockets.sockets.get(receiverSocketId).rooms.has(chat.conversation)
        ? true
        : false;

    const updatedConvo = await updateConvoRead(userStates, chat.conversation);

    updatedConvo?.members?.forEach((member) => {
      let userId = String(member.user._id);
      let sIds = getMultiKeysByValue(sockets, userId);
      sIds.forEach((sId) => {
        io.in(sId).emit("update-convo-list", updatedConvo);
      });
    });
  } catch (error) {
    console.log(error);
    io.in(chat?.sender).emit(
      "message-error",
      "Can't send message, try again later"
    );
  }
}

// export async function updateRead(sockets, userIds, room) {
//   const sender = getKeyByValue(sockets, userIds.sender);
//   const recipient = getKeyByValue(sockets, userIds.recipient);

//   const senderIsInRoom =
//     io.sockets.sockets.get(sender) &&
//     io.sockets.sockets.get(sender).rooms.has(room)
//       ? true
//       : false;

//   const recipientIsInRoom =
//     io.sockets.sockets.get(sender) &&
//     io.sockets.sockets.get(sender).rooms.has(room)
//       ? true
//       : false;
// }
