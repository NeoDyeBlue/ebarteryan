import { Server } from "socket.io";
import {
  joinConversation,
  addConversation,
  leaveConversation,
} from "../../lib/sockets/conversation-room-handler";
import { sendChat } from "../../lib/sockets/chat-handler";
import {
  checkHasUnreadConversation,
  checkHasUnreadNotification,
} from "../../lib/sockets/read-handler";
import {
  joinItemRoom,
  leaveItemRoom,
} from "../../lib/sockets/item-room-jhandler";
import {
  offerSend,
  countOffers,
  acceptOffer,
} from "../../lib/sockets/offer-handler";
import {
  questionHandler,
  answerHandler,
  countQuestions,
} from "../../lib/sockets/question-answer-handler";
import { reviewNotify } from "../../lib/sockets/review-handler";

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
        if (!sockets.has(socket.id)) {
          sockets.set(socket.id, userId);
          io.sockets.emit("user:connected", userId);
          // console.log(`${userId} connected`);
          socket.join(userId);
        }
      });

      socket.on("disconnect", () => {
        if (sockets.has(socket.id)) {
          io.sockets.emit("user:disconnected", sockets.get(socket.id));
          // console.log(`${socket.id} disconnected`);
          sockets.delete(socket.id); // delete socket from Map object
        }
      });

      // socket.on("user:disconnect", () => {
      //   if (sockets.has(socket.id)) {
      //     io.sockets.emit("user:disconnected", sockets.get(socket.id));
      //     // console.log(`${socket.id} disconnected`);
      //     sockets.delete(socket.id); // delete socket from Map object
      //   }
      // });

      socket.on("user:online-check", (userIds) => {
        io.in(userIds.client).emit("user:online", {
          isOnline: Array.from(sockets.values()).includes(userIds.userToCheck),
          user: userIds.userToCheck,
        });
      });

      socket.on("conversation:join", (rooms) => {
        joinConversation(rooms, socket);
      });

      socket.on("conversation:leave", (room) => {
        leaveConversation(room, socket);
      });

      socket.on("conversation:check-has-unread", async (user) => {
        await checkHasUnreadConversation(user, sockets, io);
      });

      socket.on("conversation:create", ({ conversation, receiver }) => {
        addConversation(io, sockets, conversation, receiver);
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

      socket.on("offer:create", async ({ offer, room }) => {
        await offerSend(io, socket, offer, room, sockets);
      });

      socket.on("offer:count", (item) => {
        countOffers(io, item);
      });

      socket.on("offer:accept", async ({ accepter, item }) => {
        await acceptOffer(io, sockets, accepter, item);
      });

      socket.on(
        "question:create",
        async ({ question, room }) =>
          await questionHandler(io, socket, question, room, sockets)
      );

      socket.on(
        "question:answer",
        async ({ answeredQuestion, answerer, room }) =>
          await answerHandler(io, answeredQuestion, answerer, room, sockets)
      );

      socket.on(
        "question:count",
        async (item) => await countQuestions(io, item)
      );

      socket.on("review:create", async (review) => {
        await reviewNotify(io, sockets, review);
      });
    });
  }
  res.end();
}
