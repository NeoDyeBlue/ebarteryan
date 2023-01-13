import { countItemOffers } from "../controllers/offer-controller";

export function offerSend(socket, offer, room) {
  console.log(offer);
  socket.to(room).emit("offer:add", offer);
}

export async function countOffers(io, item) {
  try {
    const count = await countItemOffers(item);

    io.in(item).emit("offer:update-count", count);
  } catch (error) {
    console.log(error);
  }
}
