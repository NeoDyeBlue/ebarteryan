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
import { offerSend, countOffers } from "../../lib/sockets/offer-handler";
import {
  questionHandler,
  answerHandler,
  countQuestions,
} from "../../lib/sockets/question-answer-handler";

// https://stackoverflow.com/questions/70086135/how-to-show-online-users-in-socket-io-server-in-node-js

let sockets = new Map();

export default async function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("user:connect", (userId) => {
        sockets.set(socket.id, userId);
        io.sockets.emit("user:connected", userId);
        console.log(`${userId} connected`);
        socket.join(userId);
      });

      socket.on("disconnect", () => {
        if (sockets.has(socket.id)) {
          io.sockets.emit("user:disconnected", sockets.get(socket.id));
          // console.log(`${socket.id} disconnected`);
          sockets.delete(socket.id); // delete socket from Map object
        }
      });

      socket.on("user:online-check", (userIds) => {
        io.in(userIds.client).emit("user:online", {
          isOnline: Array.from(sockets.values()).includes(userIds.userToCheck),
          user: userIds.userToCheck,
        });
      });

      socket.on("conversation:join", (rooms) => {
        joinConversation(rooms, socket);
      });

      socket.on("conversation:check-has-unread", async (user) => {
        await checkHasUnreadConversation(user, sockets, io);
      });

      socket.on("notification:count-unread", async (user) => {
        await checkHasUnreadNotification(user, sockets, io);
      });

      socket.on("chat:create", async (chat) => {
        await sendChat(chat, socket, sockets, io);
      });

      socket.on("item:join", (room) => {
        joinItemRoom(socket, room);
      });

      socket.on("item:leave", (room) => {
        leaveItemRoom(socket, room);
      });

      socket.on("offer:create", ({ offer, room }) => {
        offerSend(socket, offer, room);
      });

      socket.on("offer:count", (item) => {
        countOffers(io, item);
      });

      socket.on(
        "question:create",
        async ({ question, room }) =>
          await questionHandler(socket, io, question, room, sockets)
      );

      socket.on(
        "question:answer",
        async ({ answeredQuestion, room }) =>
          await answerHandler(io, answeredQuestion, room, sockets)
      );

      socket.on(
        "question:count",
        async (item) => await countQuestions(io, item)
      );
    });
  }
  res.end();
}
