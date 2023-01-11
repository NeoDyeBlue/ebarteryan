import { questionAnswerNotify } from "../controllers/notification-controller";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function questionHandler(io, question, room, sockets) {
  io.in(room).emit("new-question", question);
  try {
    const data = await questionAnswerNotify(
      "question",
      question?.data?.docs[0]
    );

    if (data) {
      let sIds = getMultiKeysByValue(sockets, data.receiver);
      sIds.forEach((sId) => {
        io.in(sId).emit("notification", ({ receiver, ...otherData } = data));
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function answerHandler(io, answeredQuestion, room, sockets) {
  io.in(room).emit("answered-question", answeredQuestion);

  const data = await questionAnswerNotify("answer", answeredQuestion);

  if (data) {
    let sIds = getMultiKeysByValue(sockets, data.receiver);
    sIds.forEach((sId) => {
      io.in(sId).emit("notification", ({ receiver, ...otherData } = data));
    });
  }

  try {
  } catch (error) {
    console.log(error);
  }
}
