import Notification from "../models/Notification";
import mongoose from "mongoose";
import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import User from "../models/User";
import Item from "../models/Item";

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
        sort: { createdAt: -1 },
        ...(page && limit ? { page, limit } : {}),
        populate: [
          {
            path: "item",
            select: "name",
            model: Item,
          },
          {
            path: "users",
            select: "firstName lastName image",
            model: User,
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
    await Notification.findByIdAndUpdate(
      notification,
      { read: true },
      { runValidators: true, context: "query" }
    ).exec();

    const unreadNotifications = await Notification.countDocuments({
      user,
      read: false,
    }).exec();

    return { unreadNotifications };
  } catch (error) {
    throw error;
  }
}

export async function checkHasUnreadNotif(user) {
  await dbConnect();
  try {
    const unreadNotifications = await Notification.countDocuments({
      user,
      read: false,
    });

    return unreadNotifications;
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

      const unreadNotifications = await Notification.countDocuments({
        user: itemData.user,
        read: false,
      }).exec();

      return {
        receiver: itemData.user,
        notification: populatedNewOfferNotif,
        unreadNotifications,
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
  try {
    let receiver;
    let notification;

    const itemData = await Item.findById(qaData.item).select("user").exec();
    const notifPopulateOptions = [
      {
        path: "item",
        select: "name",
        model: Item,
      },
      {
        path: "users",
        select: "firstName lastName image",
        model: User,
      },
    ];

    if (type == "question") {
      const existingNotification = await Notification.findOne({
        item: qaData.item,
        updatedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        users: { $nin: [qaData.user._id] },
        type,
        read: false,
      });

      receiver = String(itemData.user);

      if (existingNotification) {
        const updatedNotification = await Notification.findByIdAndUpdate(
          existingNotification._id,
          { $push: { $users: qaData.user._id } },
          { new: true }
        ).populate(notifPopulateOptions);

        notification = updatedNotification;
      } else {
        const _id = new mongoose.Types.ObjectId();
        const newQuestionNotif = new Notification({
          _id,
          user: itemData.user,
          users: [qaData.user._id],
          type,
          item: qaData.item,
        });

        await newQuestionNotif.save();

        const populatedNewQuestionNotif = await Notification.findById(_id)
          .populate(notifPopulateOptions)
          .exec();

        notification = populatedNewQuestionNotif;
      }

      const unreadNotifications = await Notification.countDocuments({
        user: itemData.user,
        read: false,
      }).exec();

      return {
        receiver,
        notification,
        unreadNotifications,
      };
    } else if (type == "answer") {
      receiver = qaData.user._id;
      const _id = new mongoose.Types.ObjectId();
      const newAnswerNotif = new Notification({
        _id,
        user: qaData.user._id,
        users: [itemData.user._id],
        type,
        item: qaData.item,
      });

      await newAnswerNotif.save();

      notification = await Notification.findById(_id)
        .populate(notifPopulateOptions)
        .exec();

      const unreadNotifications = await Notification.countDocuments({
        user: qaData.user._id,
        read: false,
      }).exec();

      return {
        receiver,
        notification,
        unreadNotifications,
      };
    }

    return null;
  } catch (error) {
    throw error;
  }
}
