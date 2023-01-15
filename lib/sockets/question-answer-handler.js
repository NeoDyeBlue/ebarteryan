import { notify } from "../controllers/notification-controller";
import { countItemQuestions } from "../controllers/question-controller";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function questionHandler(io, socket, question, room, sockets) {
  socket.to(room).emit("question:add", question);
  try {
    const questionNotification = await notify(
      "question",
      question.user._id,
      question.item
    );

    if (questionNotification) {
      let sIds = getMultiKeysByValue(sockets, questionNotification.receiver);
      sIds.forEach((sId) => {
        io.in(sId).emit("notification:add", questionNotification.notification);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function answerHandler(
  io,
  answeredQuestion,
  answerer,
  room,
  sockets
) {
  io.in(room).emit("question:answered", answeredQuestion);

  // console.log(answeredQuestion);

  const answerNotification = await notify(
    "answer",
    answerer,
    answeredQuestion.item
  );

  if (answerNotification) {
    let sIds = getMultiKeysByValue(sockets, answerNotification.receiver);
    sIds.forEach((sId) => {
      io.in(sId).emit("notification:add", answerNotification.notification);
    });
  }

  try {
  } catch (error) {
    console.log(error);
  }
}

export async function countQuestions(io, item) {
  try {
    const count = await countItemQuestions(item);

    io.in(item).emit("question:update-count", count);
  } catch (error) {
    console.log(error);
  }
}
