import { getMultiKeysByValue } from "../../utils/socket-utils";

export const joinConversation = (rooms, socket) => {
  if (rooms.oldRoom) {
    socket.leave(rooms.oldRoom);
  }
  if (rooms.newRoom) {
    socket.join(rooms.newRoom);
  }
};

export function leaveConversation(room, socket) {
  socket.leave(room);
}

export function addConversation(io, sockets, conversation, receiver) {
  let sIds = getMultiKeysByValue(sockets, receiver);
  sIds.forEach((sId) => {
    io.in(sId).emit("conversation:update-list", conversation);
  });
}
