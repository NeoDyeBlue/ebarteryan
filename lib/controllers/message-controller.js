import dbConnect from "../dbConnect";
import Chat from "../models/Chat";
import Conversation from "../models/Conversation";
import Item from "../models/Item";
import Offer from "../models/Offer";
import User from "../models/User";
import mongoose from "mongoose";
import { error } from "../../utils/error-utils";

export async function createConversation(sender, receiver, item, offer) {
  await dbConnect();
  try {
    const existingConversation = await Conversation.findOne({
      members: { $all: [sender, receiver] },
    })
      .populate([
        {
          path: "members",
          select: "-password -verified -email -role",
          model: User,
        },
      ])
      .exec();

    if (existingConversation) {
      return existingConversation;
    }

    const itemData = await Item.findById(item).exec();
    const offerData = await Offer.findById(offer).exec();

    if (!itemData) {
      throw error("ItemError", "Item cannot be found");
    }

    if (itemData && String(itemData.user) !== sender) {
      throw error(
        "ForbiddenError",
        "Can't create conversation that is not from your item"
      );
    }

    if (!offerData) {
      throw error("OfferError", "Offer cannot be found");
    }

    if (
      (offerData && String(offerData.item) !== item) ||
      String(offerData.user) !== receiver
    ) {
      throw error(
        "ForbiddenError",
        "Can't create conversation to a user that has not offered on your item"
      );
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
      offer: offer,
    });

    await chat.save();

    await conversation.save();

    const convoData = await Conversation.findById(conversationId)
      .populate([
        {
          path: "members",
          model: User,
          select: "firstName lastName image",
        },
      ])
      .exec();

    return convoData;
  } catch (err) {
    throw err;
  }
}

export async function getMessages(user, page, limit) {
  await dbConnect();
  try {
    const messages = await Conversation.paginate(
      {
        members: { $elemMatch: { $eq: user } },
      },
      {
        sort: { updatedAt: -1 },
        page,
        limit,
        populate: [
          {
            path: "members",
            select: "-password -email -verified -role",
            model: User,
          },
          {
            path: "lastestChat",
            populate: {
              path: "offer",
              match: { type: { $eq: "offer" } },
              select: { name: 1, item: 1, images: { $slice: ["$images", 1] } },
              model: Offer,
            },
            model: Chat,
          },
        ],
      }
    );

    return { docs: messages.docs, totalDocs: messages.totalDocs };
  } catch (err) {
    throw err;
  }
}

export async function getChats(user, room, page, limit) {
  await dbConnect();

  try {
    const inConversation = await Conversation.findOne({
      $and: [{ members: { $elemMatch: { $eq: user } } }, { _id: room }],
    });

    if (!inConversation) {
      throw error(
        "ForbiddenError",
        "Can't get chats from a conversation that you do not belong"
      );
    }

    const chats = await Chat.paginate(
      { conversation: room },
      {
        ...(page && limit ? { page, limit } : {}),
        populate: [
          {
            path: "sender",
            select: "-password -verified -role",
            model: User,
          },
          {
            path: "offer",
            match: { type: { $eq: "offer" } },
            select: { name: 1, item: 1, images: { $slice: ["$images", 1] } },
            model: Offer,
          },
        ],
        sort: { createdAt: -1 },
      }
    );

    return { docs: chats.docs, totalDocs: chats.totalDocs };
  } catch (err) {
    throw err;
  }
}
