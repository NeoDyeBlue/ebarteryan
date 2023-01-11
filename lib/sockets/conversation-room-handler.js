export const joinConversation = (rooms, socket) => {
  if (rooms.oldRoom) {
    socket.leave(rooms.oldRoom);
  }
  socket.join(rooms.newRoom);
};
