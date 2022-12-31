import { createChat, updateConvoRead } from "../controllers/message-controller";

/**
 * @see {@link https://stackoverflow.com/a/47136047}
 * @param {Map} map
 * @param {*} searchValue
 * @returns key
 */
function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
}

export async function sendChat(chat, socket, sockets, io) {
  console.log(chat);
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

    const senderSocketId = getByValue(sockets, chat.sender);
    const receiverSocketId = getByValue(sockets, chat.receiver);

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
      io.in(getByValue(sockets, userId)).emit(
        "update-convo-list",
        updatedConvo
      );
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
//   const sender = getByValue(sockets, userIds.sender);
//   const recipient = getByValue(sockets, userIds.recipient);

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
