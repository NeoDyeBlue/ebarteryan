export const joinConversation = (rooms, socket) => {
  if (rooms.oldRoom) {
    socket.leave(rooms.oldRoom);
  }
  console.log(`joined ${rooms.newRoom}`);
  socket.join(rooms.newRoom);
};
