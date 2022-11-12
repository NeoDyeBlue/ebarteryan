import { Server } from "socket.io";
import serverTimeHandler from "../../lib/sockets/server-time-handler";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      serverTimeHandler(socket);
    });
  }
  res.end();
}
