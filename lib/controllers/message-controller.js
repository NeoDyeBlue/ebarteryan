import dbConnect from "../dbConnect";
import Chat from "../models/Chat";
import Conversation from "../models/Conversation";
import Item from "../models/Item";
import Offer from "../models/Offer";
import User from "../models/User";
import mongoose from "mongoose";

/**
 *
 * @param {Array} members
 */

export async function createConversation(sender, receiver, item, offer) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).exec();
    const offerData = await Offer.findById(offer).exec();

    if (!itemData) {
      let itemError = new Error("Item cannot be found");
      itemError.name = "ItemError";
      throw itemError;
    }

    if (itemData && String(itemData.user) !== sender) {
      let forbiddenError = new Error(
        "Can't create conversation that is not from your item"
      );
      forbiddenError.name = "ForbiddenError";
      throw forbiddenError;
    }

    if (!offerData) {
      let offerError = new Error("Offer cannot be found");
      offerError.name = "OfferError";
      throw offerError;
    }

    if (
      (offerData && String(offerData.item) !== item) ||
      String(offerData.user) !== receiver
    ) {
      let forbiddenError = new Error(
        "Can't create conversation to a user that has not offered on your item"
      );
      forbiddenError.name = "ForbiddenError";
      throw forbiddenError;
    }

    const conversationId = new mongoose.Types.ObjectId();
    const chatId = new mongoose.Types.ObjectId();

    const conversation = new Conversation({
      _id: conversationId,
      members: [sender, receiver],
      latestChat: chatId,
    });

    const chat = new Chat({
      _id: chatId,
      sender,
      conversation: conversationId,
      type: "offer",
      body: "Can I ask about this offer?",
    });

    await chat.save();

    await conversation
      .save()
      .then((convo) =>
        convo.populate([
          {
            path: "members",
            model: User,
            select: "firstName lastName image",
          },
          {
            path: "latestChat",
            populate: {
              path: "offer",
              match: { type: { $eq: "offer" } },
              select: { name: 1, item: 1, images: { $slice: ["$images", 1] } },
            },
          },
        ])
      )
      .execPopulate();

    return conversation;
  } catch (error) {
    throw error;
  }
}
