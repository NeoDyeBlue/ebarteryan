import { Server } from "socket.io";
import { joinConversation } from "../../lib/sockets/conversation-room-handler";
import { sendChat } from "../../lib/sockets/chat-handler";
import {
  checkHasUnreadConversation,
  checkHasUnreadNotification,
} from "../../lib/sockets/read-handler";
import {
  joinItemRoom,
  leaveItemRoom,
} from "../../lib/sockets/item-room-jhandler";
import offerHandler from "../../lib/sockets/offer-handler";
import {
  questionHandler,
  answerHandler,
} from "../../lib/sockets/question-answer-handler";

// https://stackoverflow.com/questions/70086135/how-to-show-online-users-in-socket-io-server-in-node-js

let sockets = new Map();

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("connect-user", (userId) => {
        sockets.set(socket.id, userId);
        io.sockets.emit("user-connect", userId);
        console.log(`${userId} connected`);
        socket.join(userId);
      });

      socket.on("disconnect", () => {
        if (sockets.has(socket.id)) {
          io.sockets.emit("user-disconnect", sockets.get(socket.id));
          // console.log(`${socket.id} disconnected`);
          sockets.delete(socket.id); // delete socket from Map object
        }
      });

      socket.on("user-online-check", (userIds) => {
        io.in(userIds.client).emit("user-is-online", {
          isOnline: Array.from(sockets.values()).includes(userIds.userToCheck),
          user: userIds.userToCheck,
        });
      });

      socket.on("join-conversation", (rooms) => {
        joinConversation(rooms, socket);
      });

      socket.on("check-has-unread-convo", async (user) => {
        await checkHasUnreadConversation(user, sockets, io);
      });

      socket.on("check-has-unread-notif", async (user) => {
        await checkHasUnreadNotification(user, sockets, io);
      });

      socket.on("chat", async (chat) => {
        await sendChat(chat, socket, sockets, io);
      });

      socket.on("join-item-room", (room) => {
        joinItemRoom(socket, room);
      });

      socket.on("leave-item-room", (room) => {
        leaveItemRoom(socket, room);
      });

      socket.on("offer", ({ offer, room }) => {
        offerHandler(socket, offer, room);
      });

      socket.on(
        "question",
        async ({ question, room }) => await questionHandler(io, question, room)
      );

      socket.on(
        "answer",
        async ({ answeredQuestion, room }) =>
          await answerHandler(io, answeredQuestion, room)
      );
    });
  }
  res.end();
}
