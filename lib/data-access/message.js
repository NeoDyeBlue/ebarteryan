import dbConnect from "../dbConnect";
import Chat from "../models/Chat";
import Conversation from "../models/Conversation";
import Item from "../models/Item";
import Offer from "../models/Offer";
import User from "../models/User";
import mongoose from "mongoose";
import errorThrower from "../../utils/error-utils";
import { upload } from "../../utils/cloudinary-utils";

export async function createConversation(sender, receiver, item, offer) {
  await dbConnect();
  try {
    const existingConversation = await Conversation.findOne({
      $and: [{ "members.user": sender }, { "members.user": receiver }],
    })
      .populate([
        {
          path: "members.user",
          select: "firstName lastName image",
          model: User,
        },
      ])
      .exec();

    const itemData = await Item.findById(item).exec();
    const offerData = await Offer.findById(offer).exec();
    const acceptedOfferData = await Offer.findOne({
      $and: [{ item }, { accepted: true }],
    })
      .select("_id user")
      .exec();

    if (!itemData) {
      throw errorThrower("ItemError", "Item cannot be found");
    }

    let shouldIntiateConvo = false;
    if (itemData) {
      let itemLister = String(itemData.user);
      if (acceptedOfferData) {
        let acceptedOfferUser = String(acceptedOfferData.user);

        shouldIntiateConvo =
          acceptedOfferUser == sender || itemLister == sender;
      } else {
        shouldIntiateConvo = itemLister == sender;
      }
    }

    if (!shouldIntiateConvo) {
      throw errorThrower(
        "ForbiddenError",
        "Can't create conversation that is not from your item or your offer is not accepted"
      );
    }

    if (!offerData) {
      throw errorThrower("OfferError", "Offer cannot be found");
    }

    if (offerData && String(offerData.item) !== item) {
      throw errorThrower(
        "ForbiddenError",
        "Can't create conversation to a user that has not offered on your item"
      );
    }

    if (existingConversation) {
      const offerChatExists = await Chat.findOne({
        conversation: existingConversation._id,
        type: "offer",
        offer,
      });
      // if (!offerChatExists) {
      //   const newChatOfferId = new mongoose.Types.ObjectId();
      //   const newChatOffer = new Chat({
      //     _id: newChatOfferId,
      //     sender,
      //     conversation: existingConversation._id,
      //     type: "offer",
      //     body: "Can I ask about this offer?",
      //     offer: offer,
      //   });
      //   await newChatOffer.save();

      //   const updatedConvo = await Conversation.findByIdAndUpdate(
      //     existingConversation._id,
      //     {
      //       latestChat: newChatOfferId,
      //     },
      //     {
      //       new: true,
      //       populate: [
      //         {
      //           path: "members.user",
      //           model: User,
      //           select: "firstName lastName image",
      //         },
      //         {
      //           path: "latestChat",
      //           populate: {
      //             path: "offer",
      //             match: { type: { $eq: "offer" } },
      //             select: {
      //               name: 1,
      //               item: 1,
      //               images: { $slice: ["$images", 1] },
      //             },
      //             model: Offer,
      //           },
      //           model: Chat,
      //         },
      //       ],
      //     }
      //   );

      //   return { convo: updatedConvo, newOffer: true };
      // } else {
      return {
        convo: existingConversation,
        newOffer: offerChatExists ? false : true,
      };
    }

    const conversationId = new mongoose.Types.ObjectId();
    // const chatId = new mongoose.Types.ObjectId();

    const conversation = new Conversation({
      _id: conversationId,
      members: [{ user: sender, read: true }, { user: receiver }],
      // latestChat: chatId,
    });

    // const chat = new Chat({
    //   _id: chatId,
    //   sender,
    //   conversation: conversationId,
    //   type: "offer",
    //   body: "Can I ask about this offer?",
    //   offer: offer,
    // });

    // await chat.save();

    await conversation.save();

    const convoData = await Conversation.findById(conversationId)
      .populate([
        {
          path: "members.user",
          model: User,
          select: "firstName lastName image",
        },
        // {
        //   path: "latestChat",
        //   populate: {
        //     path: "offer",
        //     match: { type: { $eq: "offer" } },
        //     select: { name: 1, item: 1, images: { $slice: ["$images", 1] } },
        //     model: Offer,
        //   },
        //   model: Chat,
        // },
      ])
      .exec();

    return { convo: convoData, newOffer: true };
  } catch (err) {
    throw err;
  }
}

export async function getMessages(user, page, limit, search) {
  await dbConnect();
  try {
    let userIds = [];
    if (search) {
      userIds = (
        await User.find({
          $and: [
            { _id: { $ne: user } },
            {
              $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                {
                  $expr: {
                    $regexMatch: {
                      input: { $concat: ["$firstName", " ", "$lastName"] },
                      regex: search, //Your text search here
                      options: "i",
                    },
                  },
                },
              ],
            },
          ],
        })
          .select("_id")
          .exec()
      ).map((user) => [user._id.valueOf()]);
    }

    const messages = await Conversation.paginate(
      {
        ...(search
          ? {
              members: {
                $all: [
                  {
                    $elemMatch: { user: { $eq: user } },
                  },
                  {
                    $elemMatch: { user: { $in: userIds } },
                  },
                ],
              },
            }
          : { members: { $elemMatch: { user: { $eq: user } } } }),
        latestChat: { $ne: null },
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

export async function createChat({
  sender,
  conversation,
  images = [],
  body,
  type,
  offer,
}) {
  await dbConnect();

  try {
    // let type =
    //   images.length && !body
    //     ? "image"
    //     : images.length && body
    //     ? "mixed"
    //     : "text";
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
      offer,
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

    await Conversation.findByIdAndUpdate(conversation, {
      latestChat: chatData._id,
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
      throw errorThrower(
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

export async function deleteConversation(conversation, user) {
  await dbConnect();
  try {
    await Conversation.findOneAndDelete({
      _id: conversation,
      temporary: true,
      "members.user": user,
    });

    return { message: "Conversation removed" };
  } catch (error) {
    throw error;
  }
}

export async function checkHasUnreadConvo(user) {
  await dbConnect();
  try {
    let hasUnread = false;
    const conversations = await Conversation.find({
      members: { $elemMatch: { user: { $eq: user }, read: false } },
      latestChat: { $ne: null },
    });

    if (conversations && conversations.length) hasUnread = true;

    return hasUnread;
  } catch (error) {
    throw error;
  }
}
