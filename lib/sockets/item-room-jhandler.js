export const joinItemRoom = (socket, room) => {
  // console.log(`joined ${room}`);
  socket.join(room);
};

export const leaveItemRoom = (socket, room) => {
  // console.log(`left ${room}`);
  socket.leave(room);
};
