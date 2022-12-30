import { createChat } from "../controllers/message-controller";

export async function sendChat(chat, socket, io) {
  console.log(chat);
  try {
    const newChat = await createChat(
      chat?.sender,
      chat?.conversation,
      chat?.images,
      chat?.body
    );

    newChat?.conversation?.members?.forEach((member) => {
      io.in(member._id).emit("update-convo-list", newChat.conversation);
      //   if (newChat.sender._id != member._id) {
      //     socket.to(member._id).emit("message-receive", newChat.chat);
      //   }
    });

    socket.to(chat?.conversation).emit("message-receive", newChat.chat);
  } catch (error) {
    console.log(error);
    io.in(chat?.sender).emit(
      "message-error",
      "Can't send message, try again later"
    );
  }
}
