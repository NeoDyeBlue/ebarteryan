import { Server } from "socket.io";
import serverTimeHandler from "../../lib/sockets/server-time-handler";
import {
  joinItemRoom,
  leaveItemRoom,
} from "../../lib/sockets/item-room-jhandler";
import offerHandler from "../../lib/sockets/offer-handler";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      serverTimeHandler(socket);

      socket.on("join-item-room", (room) => {
        joinItemRoom(socket, room);
      });

      socket.on("leave-item-room", (room) => {
        leaveItemRoom(socket, room);
      });

      socket.on("offer", ({ offer, room }) => {
        offerHandler(socket, offer, room);
      });
    });
  }
  res.end();
}
