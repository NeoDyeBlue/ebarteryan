export function questionHandler(io, question, room) {
  io.in(room).emit("new-question", question);
}

export function answerHandler(io, answeredQuestion, room) {
  io.in(room).emit("answered-question", answeredQuestion);
}
