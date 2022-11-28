export default function offerHandler(socket, offer, room) {
  console.log(offer);
  socket.to(room).emit("another-offer", offer);
}
