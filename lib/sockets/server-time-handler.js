export default function serverTimeHandler(socket) {
  setInterval(function () {
    const datetime = new Date().getTime();
    socket.emit("server-time", datetime);
  }, 1000);
}
