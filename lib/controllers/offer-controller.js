import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import Item from "../models/Item";
import { upload, destroy, destroyFolder } from "../../utils/cloudinary-utils";
import mongoose from "mongoose";
import User from "../models/User";
import Category from "../models/Category";
import Conversation from "../models/Conversation";
import Review from "../models/Review";
import errorThrower from "../../utils/error-utils";
import Notification from "../models/Notification";

/**
 * creates an offer
 * @param {Object} param0
 * @returns
 */

export async function createOffer({
  item,
  user,
  name,
  images,
  description,
  condition,
  location,
}) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).exec();

    if (!itemData) {
      throw errorThrower("ItemError", "Item does not exist");
    }

    if (!itemData.available || itemData.ended) {
      throw errorThrower("OfferError", "Item is unavailable");
    }

    const offerExists = await Offer.findOne({
      user,
      item,
    }).exec();

    if (offerExists) {
      throw errorThrower("OfferError", "Offer already exists");
    }

    const _id = new mongoose.Types.ObjectId();
    const uploads = await upload(`ebarteryan/offers/${item}/${_id}`, images);

    const conversation = await Conversation.findOne({
      members: {
        $all: [
          {
            $elemMatch: { user: { $eq: itemData.user } },
          },
          {
            $elemMatch: { user },
          },
        ],
      },
    });

    const newOffer = new Offer({
      _id,
      item,
      user,
      name,
      images: uploads,
      description,
      condition,
      ...(conversation?._id ? { conversation: conversation?._id } : {}),
      region: location.region,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
    });

    await newOffer.save();

    const offer = await Offer.findById(_id)
      .populate("user", "firstName lastName fullName image", User)
      .exec();

    return offer;
  } catch (error) {
    throw error;
  }
}

/**
 * updates the offer
 * @param {String} user
 * @param {String} offer
 * @param {Object} values
 * @returns
 */

export async function updateOffer(user, offer, values) {
  await dbConnect();
  try {
    if (
      (values?.newImages && values.newImages.length) ||
      (values?.toRemoveImages && values.toRemoveImages.length)
    ) {
      const offerData = await Offer.findOne({ user, offer })
        .select("images item")
        .exec();

      if (!offerData) {
        throw errorThrower("OfferError", "Offer does not exist");
      }

      values.images = offerData.images;
      if (values?.newImages && values.newImages.length) {
        const uploads = await upload(
          `ebarteryan/offers/${offerData?.item}/${offer}`,
          values.newImages
        );
        values.images.push(...uploads);
      }

      if (values?.toRemoveImages && values.toRemoveImages.length) {
        const destroys = await destroy(
          values.toRemoveImages.map((image) => image.cloudId)
        );
        values.images = values.images.filter(
          (image) => !destroys.includes(image.cloudId)
        );
      }
    }

    const updatedOffer = await Offer.findOneAndUpdate(
      { user, offer },
      { ...values, edited: true },
      {
        new: true,
      }
    ).exec();

    if (!updatedOffer) {
      throw errorThrower("OfferError", "Can't update offer");
    }

    return updatedOffer;
  } catch (error) {
    throw error;
  }
}

/**
 * deletes the offer
 * @param {String} user
 * @param {String} offer
 * @returns
 */

export async function deleteOffer(user, offer) {
  await dbConnect();
  try {
    const offerData = await Offer.findOne({ user, offer })
      .select("user images")
      .exec();

    if (!offerData) {
      throw errorThrower("OfferError", "Can't delete offer");
    }

    await destroy(offerData?.images?.map((image) => image.cloudId));
    await destroyFolder(
      `/ebarteryan/offers/${offerData.item}/${offerData._id}`
    );

    await Offer.findByIdAndDelete(offerData._id).exec();

    return { message: "Offer deleted" };
  } catch (error) {
    throw error;
  }
}

/**
 * gets the offers of an item with pagination
 * @param {String} item
 * @param {String} user
 * @param {Number} page
 * @param {Number} limit
 * @returns
 */

export async function getItemOffers(item, user, page, limit) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).exec();
    if (!itemData) {
      throw errorThrower("ItemError", "Item does not exist");
    }

    const offersAggregate = Offer.aggregate([
      {
        $match: {
          ...(user
            ? {
                $and: [
                  { item: mongoose.Types.ObjectId(item) },
                  { user: { $ne: mongoose.Types.ObjectId(user) } },
                  { accepted: false },
                ],
              }
            : { item: mongoose.Types.ObjectId(item) }),
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          let: { user_id: "$user" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$user_id", "$_id"] } } },
            {
              $lookup: {
                from: Review.collection.name,
                localField: "_id",
                foreignField: "user",
                let: { user_id: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$user_id", "$user"] } } },
                  {
                    $group: {
                      _id: "$user",
                      count: { $sum: 1 },
                      rating: {
                        $avg: "$rate",
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      count: "$count",
                      rating: "$rating",
                    },
                  },
                ],
                as: "reviews",
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                createdAt: 1,
                fullName: 1,
                image: 1,
                reviews: {
                  $ifNull: [{ $first: "$reviews" }, { count: 0, rating: 0 }],
                },
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    const offers = await Offer.aggregatePaginate(offersAggregate, {
      sort: { createdAt: -1 },
      ...(page && limit ? { page, limit } : {}),
    });

    return { docs: offers.docs, totalDocs: offers.totalDocs };
  } catch (error) {
    throw error;
  }
}

/**
 * Accepts the offer
 * @param {String} offer
 * @param {String} user
 * @param {String} item
 * @param {Boolean} accepted
 * @returns
 */

export async function acceptOffer(offer, user, item, accepted) {
  await dbConnect();

  try {
    const itemData = await Item.findById(item).select("user").exec();
    if (!itemData) {
      throw errorThrower("ItemError", "Item does not exist");
    } else if (itemData && String(itemData.user) !== user) {
      throw errorThrower(
        "ForbiddenError",
        "Can't accept/unaccept offer from other items"
      );
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offer,
      { accepted },
      {
        new: true,
      }
    ).exec();

    if (!updatedOffer) {
      throw errorThrower("OfferError", "Offer does not exist");
    }

    if (accepted) {
      const oldAcceptedOffer = await Offer.findOneAndUpdate(
        { item, _id: { $ne: updatedOffer._id }, accepted: true },
        { accepted: false },
        { new: true }
      );

      if (oldAcceptedOffer) {
        await Notification.findOneAndDelete({
          offer: oldAcceptedOffer._id,
          type: "offer-accepted",
        });
      }
    } else {
      await Notification.findOneAndDelete({ item, type: "item-ended" });
      await Notification.findOneAndDelete({
        offer: updatedOffer._id,
        type: "offer-accepted",
      });
    }

    await Item.findByIdAndUpdate(
      item,
      { ended: accepted },
      {
        new: true,
      }
    ).exec();

    return { offer };
  } catch (error) {
    throw error;
  }
}

/**
 * gets the offer of the current user on the item
 * @param {String} item
 * @param {String} user
 * @returns
 */

export async function getUserOffer(item, user) {
  await dbConnect();
  try {
    const offerData = await Offer.findOne({ $and: [{ item }, { user }] })
      .populate("user", "firstName lastName fullName image", User)
      .exec();

    return offerData;
  } catch (error) {
    throw error;
  }
}

/**
 * gets the accepted offer
 * @param {String} item
 * @returns
 */

export async function getAcceptedOffer(item) {
  await dbConnect();
  try {
    const offerData = await Offer.findOne({
      $and: [{ item }, { accepted: true }],
    })
      .populate("user", "firstName lastName fullName image", User)
      .exec();

    return offerData;
  } catch (error) {
    throw error;
  }
}

/**
 * gets the user offers from different items with pagination
 * @param {String} user
 * @param {String} status
 * @param {Number} page
 * @param {number} limit
 * @returns
 */

export async function getUserOffers(user, status = "all", page, limit) {
  await dbConnect();
  try {
    let query = { user: mongoose.Types.ObjectId(user) };
    let offers;

    if (status == "waiting") {
      query = {
        $and: [
          { user: mongoose.Types.ObjectId(user) },
          { "item.available": true },
          { "item.ended": false },
          { accepted: false },
        ],
      };
    } else if (status == "failed") {
      query = {
        $and: [
          { user: mongoose.Types.ObjectId(user) },
          {
            $or: [
              { "item.available": false },
              { "item.ended": true },
              { item: { $eq: null } },
            ],
          },
          { accepted: false },
        ],
      };
    } else if (status == "accepted") {
      query = {
        $and: [
          { user: mongoose.Types.ObjectId(user) },
          { accepted: true },
          { reviewed: false },
          { item: { $ne: null } },
        ],
      };
    } else if (status == "reviewed") {
      query = {
        $and: [{ user: mongoose.Types.ObjectId(user) }, { reviewed: true }],
      };
    }

    const offersAggregate = Offer.aggregate([
      {
        $lookup: {
          from: Item.collection.name,
          localField: "item",
          foreignField: "_id",
          let: { item_id: "$item" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$item_id", "$_id"] } } },
            {
              $lookup: {
                from: User.collection.name,
                localField: "user",
                foreignField: "_id",
                let: { user_id: "$user" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$user_id", "$_id"] } } },
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      image: 1,
                    },
                  },
                ],
                as: "user",
              },
            },
            {
              $lookup: {
                from: Category.collection.name,
                localField: "category",
                foreignField: "_id",
                let: { category_id: "$category" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$category_id", "$_id"] } } },
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                    },
                  },
                ],
                as: "category",
              },
            },
            { $unwind: "$user" },
            { $unwind: "$category" },
            {
              $project: {
                name: 1,
                _id: 1,
                user: 1,
                category: 1,
                available: 1,
                ended: 1,
                createdAt: 1,
                image: { $first: "$images" },
              },
            },
          ],
          as: "item",
        },
      },
      {
        $addFields: {
          item: {
            $ifNull: [{ $first: "$item" }, null],
          },
        },
      },
      { $match: query },
      // { $unwind: "$item" },
      {
        $project: {
          user: 1,
          image: { $first: "$images" },
          item: 1,
          name: 1,
          accepted: 1,
          reviewed: 1,
          createdAt: 1,
        },
      },
    ]);

    offers = await Offer.aggregatePaginate(offersAggregate, {
      ...(page && limit ? { page, limit } : {}),
    });

    return { docs: offers.docs, totalDocs: offers.totalDocs };
  } catch (error) {
    throw error;
  }
}

export async function countItemOffers(item) {
  await dbConnect();
  try {
    const offerCount = await Offer.countDocuments({ item }).exec();

    return offerCount;
  } catch (error) {
    throw error;
  }
}
