import Notification from "../models/Notification";
import mongoose from "mongoose";
import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import User from "../models/User";
import Item from "../models/Item";
import Question from "../models/Question";

async function createNewNotification(type, receiver, user, item) {
  await dbConnect();
  try {
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
    const _id = new mongoose.Types.ObjectId();
    const newNotif = new Notification({
      _id,
      user: receiver,
      users: [user],
      type,
      item,
    });

    await newNotif.save();

    const populatedNewNotif = await Notification.findById(_id)
      .populate(notifPopulateOptions)
      .exec();

    return populatedNewNotif;
  } catch (error) {
    throw error;
  }
}

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

/**
 *
 * @param {String} type - accepts: 'offer', 'offer-accepted',
 * 'question', 'answer', 'review'
 * @param {String} user - User ID that creates the notification
 * @param {*} item - Item ID
 * @returns {Object} - the notification object that contains the receiver and the notification
 */

export async function notify(type, user, item) {
  await dbConnect();
  try {
    const data = {
      receiver: null,
      notification: null,
    };

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

    const itemData = await Item.findById(item).select("user").exec();

    if (itemData) {
      if (type == "offer" || type == "question") {
        data.receiver = String(itemData.user);
        const existingNotification = await Notification.findOne({
          item,
          updatedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
          users: { $nin: [user] },
          type,
          read: false,
        });

        if (existingNotification) {
          const updatedNotification = await Notification.findByIdAndUpdate(
            existingNotification._id,
            { $addToSet: { users: user } },
            { new: true }
          )
            .populate(notifPopulateOptions)
            .exec();

          data.notification = updatedNotification;
        } else {
          data.notification = await createNewNotification(
            type,
            itemData.user,
            user,
            item
          );
        }

        // const unreadNotifications = await Notification.countDocuments({
        //   user: itemData.user,
        //   read: false,
        // }).exec();

        // data.unreadNotifications = unreadNotifications
      } else if (type == "answer" || type == "offer-accepted") {
        let userData;
        if (type == "answer") {
          userData = await Question.findOne({ item }).select("user").exec();
        } else if (type == "offer-accepted") {
          userData = await Offer.findOne({ item }).select("user").exec();
        }

        if (userData) {
          data.receiver = String(userData.user);
          data.notification = await createNewNotification(
            type,
            userData.user,
            user,
            item
          );
        }
      } else if (type == "review") {
        data.receiver = user;
        data.notification = await createNewNotification(
          type,
          itemData.user,
          user,
          item
        );
      }
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function countUnreadNotifications(user) {
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
