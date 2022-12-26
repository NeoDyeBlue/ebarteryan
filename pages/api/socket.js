import { Server } from "socket.io";
import serverTimeHandler from "../../lib/sockets/server-time-handler";
import {
  joinItemRoom,
  leaveItemRoom,
} from "../../lib/sockets/item-room-jhandler";
import offerHandler from "../../lib/sockets/offer-handler";
import {
  questionHandler,
  answerHandler,
} from "../../lib/sockets/question-answer-handler";
import { getToken } from "next-auth/jwt";

// https://stackoverflow.com/questions/70086135/how-to-show-online-users-in-socket-io-server-in-node-js

let sockets = new Map();

export default async function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      const token = await getToken({ req });
      socket.on("initialize", () => {
        let userId;
        if (token && token.verified) {
          userId = token.sub;
          sockets.set(userId, socket);
          io.sockets.emit("user-connect", userId);
          console.log(`${userId} connected`);
          socket.join(userId);
        }
      });

      socket.on("disconnect", () => {
        if (sockets.get(socket.id)) {
          io.sockets.emit("user-disconnect", socket.id);
          console.log(`${socket.id} disconnected`);
          sockets.delete(socket.id); // delete socket from Map object
        }
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

      socket.on("question", ({ question, room }) =>
        questionHandler(io, question, room)
      );

      socket.on("answer", ({ answeredQuestion, room }) =>
        answerHandler(io, answeredQuestion, room)
      );
    });
  }
  res.end();
}
