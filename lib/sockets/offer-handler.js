import { countItemOffers } from "../data-access/offer";
import { notify } from "../data-access/notification";
import { getMultiKeysByValue } from "../../utils/socket-utils";

export async function offerSend(io, socket, offer, room, sockets) {
  socket.to(room).emit("offer:add", offer);

  try {
    const offerNotification = await notify("offer", offer.user._id, offer.item);

    if (offerNotification) {
      let sIds = getMultiKeysByValue(sockets, offerNotification.receiver);
      sIds.forEach((sId) => {
        io.in(sId).emit("notification:add", offerNotification.notification);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function countOffers(io, item) {
  try {
    const count = await countItemOffers(item);

    io.in(item).emit("offer:update-count", count);
  } catch (error) {
    console.log(error);
  }
}

export async function acceptOffer(io, sockets, accepter, item) {
  try {
    const offerAcceptNotification = await notify(
      "offer-accepted",
      accepter,
      item
    );

    if (offerAcceptNotification) {
      let sIds = getMultiKeysByValue(sockets, offerAcceptNotification.receiver);
      sIds.forEach((sId) => {
        io.in(sId).emit(
          "notification:add",
          offerAcceptNotification.notification
        );
      });
    }
  } catch (error) {
    console.log(error);
  }
}
