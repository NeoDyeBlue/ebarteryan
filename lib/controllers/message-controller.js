import dbConnect from "../dbConnect";
import Chat from "../models/Chat";
import Conversation from "../models/Conversation";
import Item from "../models/Item";
import Offer from "../models/Offer";
import User from "../models/User";
import mongoose from "mongoose";
import { error } from "../../utils/error-utils";
import { upload } from "../../utils/cloudinary-utils";

export async function createConversation(sender, receiver, item, offer) {
  await dbConnect();
  try {
    const existingConversation = await Conversation.findOne({
      members: { $all: [{ user: sender }, { user: receiver }] },
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
      members: [{ user: sender, read: true }, { user: receiver }],
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

    await Offer.findByIdAndUpdate(offer, {
      conversation: conversationId,
    });

    const convoData = await Conversation.findById(conversationId)
      .populate([
        {
          path: "members.user",
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
        members: { $elemMatch: { user: { $eq: user } } },
      },
      {
        sort: { updatedAt: -1 },
        ...(page && limit ? { page, limit } : {}),
        populate: [
          {
            path: "members.user",
            select: "firstName lastName image",
            model: User,
          },
          {
            path: "latestChat",
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

export async function createChat(sender, conversation, images = [], body) {
  await dbConnect();

  try {
    let type =
      images.length && !body
        ? "image"
        : images.length && body
        ? "mixed"
        : "text";
    let uploads;

    // console.log(sender, conversation, body);
    const chatId = new mongoose.Types.ObjectId();

    if (images.length) {
      uploads = await upload(
        `ebarteryan/conversations/${conversation}`,
        images
      );
    }

    const newChat = new Chat({
      _id: chatId,
      sender,
      conversation,
      images: images.length ? uploads : [],
      type,
      body,
    });

    await newChat.save();

    const chatData = await Chat.findById(chatId)
      .populate([
        {
          path: "sender",
          select: "firstName lastName image",
          model: User,
        },
        {
          path: "offer",
          match: { type: { $eq: "offer" } },
          select: { name: 1, item: 1, images: { $slice: ["$images", 1] } },
          model: Offer,
        },
      ])
      .exec();

    await Conversation.findOneAndUpdate(conversation, {
      latestChat: chatId,
    });

    return chatData;
  } catch (err) {
    throw err;
  }
}

export async function getChats(user, room, page, limit) {
  await dbConnect();

  try {
    const inConversation = await Conversation.findOne({
      $and: [
        { members: { $elemMatch: { user: { $eq: user } } } },
        { _id: room },
      ],
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
            select: "firstName lastName image",
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

    // await Conversation.findOneAndUpdate(
    //   { _id: room, "members.user": user },
    //   {
    //     $set: {
    //       "members.$[element].read": true,
    //     },
    //   },
    //   {
    //     arrayFilters: [
    //       {
    //         "element.user": user,
    //       },
    //     ],
    //   }
    // );

    await Conversation.findOneAndUpdate(
      { _id: room, "members.user": user },
      {
        $set: {
          "members.$.read": true,
        },
      }
    );

    return { docs: chats.docs, totalDocs: chats.totalDocs };
  } catch (err) {
    throw err;
  }
}

export async function updateConvoRead(users, conversation) {
  await dbConnect();

  try {
    await Conversation.bulkWrite([
      {
        updateOne: {
          filter: {
            _id: conversation,
            "members.user": mongoose.Types.ObjectId(users.sender.id),
          },
          update: {
            $set: {
              "members.$.read": users.sender.inRoom,
            },
          },
        },
      },
      {
        updateOne: {
          filter: {
            _id: conversation,
            "members.user": mongoose.Types.ObjectId(users.receiver.id),
          },
          update: {
            $set: {
              "members.$.read": users.receiver.inRoom,
            },
          },
        },
      },
    ]);

    const convoData = await Conversation.findById(conversation)
      .populate([
        {
          path: "members.user",
          select: "firstName lastName image",
          model: User,
        },
        {
          path: "latestChat",
          populate: {
            path: "offer",
            match: { type: { $eq: "offer" } },
            select: { name: 1, item: 1, images: { $slice: ["$images", 1] } },
            model: Offer,
          },
          model: Chat,
        },
      ])
      .exec();

    return convoData;
  } catch (err) {
    throw err;
  }
}
