import Notification from "../models/Notification";
import mongoose from "mongoose";
import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import User from "../models/User";
import Item from "../models/Item";
import Question from "../models/Question";

/**
 *
 * @param {String} user - user ID
 * @param {Boolean} unread - shows unread notifications only
 * @param {Number} page - what page
 * @param {Number} limit - how many results in a page
 * @returns
 */

export async function getNotifications(user, unread = false, page, limit) {
  await dbConnect();
  try {
    const notifications = await Notification.paginate(
      {
        user,
        ...(unread ? { read: false } : {}),
      },
      {
        sort: { updatedAt: -1 },
        ...(page && limit ? { page, limit } : {}),
        populate: [
          {
            path: "item",
            select: "name user",
            model: Item,
            populate: {
              path: "user",
              select: "firstName lastName image",
              model: User,
            },
          },
          {
            path: "question",
            populate: {
              path: "user",
              select: "firstName lastName image",
              model: User,
            },
            model: Question,
          },
          {
            path: "offer",
            select: "user",
            populate: {
              path: "user",
              select: "firstName lastName image",
              model: User,
            },
            model: Offer,
          },
        ],
      }
    );

    return { docs: notifications.docs, totalDocs: notifications.totalDocs };
  } catch (error) {
    throw error;
  }
}

export async function updateNotificationRead(user, notification) {
  await dbConnect();
  try {
    await Notification.findByIdAndUpdate(notification, { read: true }).exec();

    const unreadNotifications = await Notification.countDocuments({
      user,
      read: false,
    }).exec();

    return unreadNotifications;
  } catch (error) {
    throw error;
  }
}

export async function checkHasUnreadNotif(user) {
  await dbConnect();
  try {
    const unreadCount = await Notification.countDocuments({
      user,
      read: false,
    });

    return unreadCount;
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {String} offer - offer ID
 * @param {String} item - item ID
 * @returns
 */

export async function offerNotify(offer, item) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).select("user").exec();

    if (itemData) {
      const _id = new mongoose.Types.ObjectId();
      const newOfferNotif = new Notification({
        _id,
        user: itemData.user,
        type: "offer",
        offer,
        item,
      });

      await newOfferNotif.save();

      const populatedNewOfferNotif = await Notification.findById(_id)
        .populate([
          { path: "item", select: "name", model: Item },
          {
            path: "offer",
            select: "user",
            populate: {
              path: "user",
              select: "firstName lastName image",
              model: User,
            },
            model: Offer,
          },
        ])
        .exec();

      const unreadCount = await Notification.countDocuments({
        user: itemData.user,
        read: false,
      }).exec();

      return {
        receiver: itemData.user,
        notification: populatedNewOfferNotif,
        unreadCount,
      };
    }
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {String} type - 'question' or 'anwser' only
 * @param {Object} qaData - question answer data
 */

export async function questionAnswerNotify(type, qaData) {
  await dbConnect();
  console.log(qaData);
  try {
    if (type == "question") {
      const itemData = await Item.findById(qaData.item).select("user").exec();
      if (itemData) {
        const _id = new mongoose.Types.ObjectId();

        const newQuestionNotif = new Notification({
          _id,
          user: itemData.user,
          type,
          question: qaData._id,
          item: qaData.item,
        });

        await newQuestionNotif.save();

        const populatedNewQuestionNotif = await Notification.findById(
          _id
        ).populate([
          { path: "user", select: "firstName lastName image", model: User },
          { path: "item", select: "name", model: Item },
        ]);

        const unreadCount = await Notification.countDocuments({
          user: itemData.user,
          read: false,
        }).exec();

        return {
          receiver: itemData.user,
          notification: populatedNewQuestionNotif,
          unreadCount,
        };
      }
    } else if (type == "answer") {
      const _id = new mongoose.Types.ObjectId();
      const newAnswerNotif = new Notification({
        _id,
        user: qaData.user,
        type,
        question: qaData._id,
        item: qaData.item,
      });

      await newAnswerNotif.save();

      const populatedNewAnswerNotif = await Notification.findById(_id).populate(
        [
          {
            path: "item",
            select: "name user",
            populate: {
              path: "user",
              select: "firstName lastName image",
              model: User,
            },
            model: Item,
          },
        ]
      );

      const unreadCount = await Notification.countDocuments({
        user: qaData.user,
        read: false,
      }).exec();

      return {
        receiver: qaData.user,
        notification: populatedNewAnswerNotif,
        unreadCount,
      };
    }

    return null;
  } catch (error) {
    throw error;
  }
}
