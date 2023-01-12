import { questionAnswerNotify } from "../controllers/notification-controller";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function questionHandler(io, question, room, sockets) {
  io.in(room).emit("new-question", question);
  try {
    const data = await questionAnswerNotify(
      "question",
      question?.data?.docs[0]
    );

    console.log(data);

    if (data) {
      let sIds = getMultiKeysByValue(sockets, data.receiver);
      const { receiver, ...otherData } = data;
      sIds.forEach((sId) => {
        io.in(sId).emit("notification", otherData);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function answerHandler(io, answeredQuestion, room, sockets) {
  io.in(room).emit("answered-question", answeredQuestion);

  const data = await questionAnswerNotify("answer", answeredQuestion);

  console.log(data);

  if (data) {
    let sIds = getMultiKeysByValue(sockets, data.receiver);
    const { receiver, ...otherData } = data;
    sIds.forEach((sId) => {
      io.in(sId).emit("notification", otherData);
    });
  }

  try {
  } catch (error) {
    console.log(error);
  }
}
