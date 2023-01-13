import { questionAnswerNotify } from "../controllers/notification-controller";
import { countItemQuestions } from "../controllers/question-controller";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function questionHandler(socket, io, question, room, sockets) {
  const data = question;
  socket.to(room).emit("question:add", data);
  try {
    const questionNotification = await questionAnswerNotify(
      "question",
      data.question
    );

    if (questionNotification) {
      let sIds = getMultiKeysByValue(sockets, questionNotification.receiver);
      const { receiver, ...otherData } = questionNotification;
      sIds.forEach((sId) => {
        io.in(sId).emit("notification:add", otherData);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function answerHandler(io, answeredQuestion, room, sockets) {
  io.in(room).emit("question:answered", answeredQuestion);

  const answerNotification = await questionAnswerNotify(
    "answer",
    answeredQuestion
  );

  if (answerNotification) {
    let sIds = getMultiKeysByValue(sockets, answerNotification.receiver);
    const { receiver, ...otherData } = answerNotification;
    sIds.forEach((sId) => {
      io.in(sId).emit("notification:add", otherData);
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
