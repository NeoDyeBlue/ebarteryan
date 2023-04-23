import { notify } from "../controllers/notification-controller";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function reviewNotify(io, sockets, review) {
  try {
    const reviewNotification = await notify(
      "review",
      review.reviewer,
      review.item
    );

    if (reviewNotification) {
      let sIds = getMultiKeysByValue(sockets, reviewNotification.receiver);
      sIds.forEach((sId) => {
        io.in(sId).emit("notification:add", reviewNotification.notification);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
