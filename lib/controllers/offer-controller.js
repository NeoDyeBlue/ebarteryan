import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import Item from "../models/Item";
import { upload } from "../../utils/cloudinary-utils";
import mongoose from "mongoose";
import User from "../models/User";
import Category from "../models/Category";
import Conversation from "../models/Conversation";
import Review from "../models/Review";

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
    console.log(item);
    const itemData = await Item.findById(item).exec();

    if (!itemData) {
      let itemError = new Error("item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

    if (!itemData.available || itemData.ended) {
      let itemError = new Error("item unavailable");
      itemError.name = "OfferError";
      throw itemError;
    }

    const offerExists = await Offer.findOne({
      user,
      item,
    }).exec();

    if (offerExists) {
      let offerError = new Error("An offer already exists");
      offerError.name = "OfferError";
      throw offerError;
    }

    const _id = new mongoose.Types.ObjectId();
    const uploads = await upload(`ebarteryan/offers/${item}/${_id}`, images);

    console.log(_id, "here");

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
    console.log(error);
    throw error;
  }
}

export async function getItemOffers(item, user, page, limit) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).exec();
    if (!itemData) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
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
      {
        $lookup: {
          from: Conversation.collection.name,
          localField: "conversation",
          foreignField: "_id",
          let: { convo_id: "$conversation" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$convo_id", "$_id"] } } },
            {
              $unwind: "$members",
            },
            {
              $lookup: {
                from: User.collection.name,
                localField: "members.user",
                foreignField: "_id",
                let: { user_id: "$members.user" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$user_id", "$_id"] } } },
                  {
                    $project: {
                      _id: 1,
                      firstName: 1,
                      lastName: 1,
                      image: 1,
                    },
                  },
                ],
                as: "members.user",
              },
            },
            { $unwind: "$members.user" },
            // { $project: { "$members.user": { $first: "$members.user" } } },
            {
              $group: {
                _id: "$_id",
                members: { $push: "$members" },
              },
            },
          ],
          as: "conversation",
        },
      },
      { $unwind: "$conversation" },
    ]);

    // const offers1 = await Offer.paginate(
    //   {
    //     ...(user
    //       ? { $and: [{ item }, { user: { $ne: user } }, { accepted: false }] }
    //       : { item }),
    //   },
    //   // { item },
    //   {
    //     ...(page && limit ? { page, limit } : {}),
    //     populate: [
    //       {
    //         path: "user",
    //         select: "firstName lastName fullName image",
    //         model: User,
    //       },
    //       {
    //         path: "conversation",
    //         populate: {
    //           path: "members",
    //           select: "-password -email -verified",
    //           model: User,
    //         },
    //       },
    //     ],
    //   }
    // );

    // const totalDocs = await Offer.countDocuments({ item });

    const offers = await Offer.aggregatePaginate(offersAggregate, {
      sort: { createdAt: -1 },
      ...(page && limit ? { page, limit } : {}),
    });

    // console.log(offers);

    return { docs: offers.docs, totalDocs: offers.totalDocs };
  } catch (error) {
    throw error;
  }
}

export async function acceptOffer(offer, user, item, accepted) {
  await dbConnect();

  try {
    const itemData = await Item.findById(item).select("user").exec();
    if (!itemData) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    } else if (itemData && String(itemData.user) !== user) {
      let forbiddenError = new Error("Can't accept offer");
      forbiddenError.name = "ForbiddenError";
      throw forbiddenError;
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offer,
      { accepted },
      {
        new: true,
      }
    ).exec();

    if (!updatedOffer) {
      let offerError = new Error("Offer not found");
      offerError.name = "OfferError";
      throw offerError;
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

export async function getUserOffer(item, user) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).exec();
    if (!itemData) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

    const offerData = await Offer.findOne({ $and: [{ item }, { user }] })
      .populate("user", "firstName lastName fullName image", User)
      .exec();

    return offerData;
  } catch (error) {
    throw error;
  }
}

export async function getAcceptedOffer(item) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).exec();
    if (!itemData) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

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
          { $or: [{ "item.available": false }, { "item.ended": true }] },
          { accepted: false },
        ],
      };
    } else if (status == "accepted") {
      query = {
        $and: [
          { user: mongoose.Types.ObjectId(user) },
          { accepted: true },
          { received: false },
        ],
      };
    } else if (status == "received") {
      query = {
        $and: [{ user: mongoose.Types.ObjectId(user) }, { received: true }],
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
      { $unwind: "$item" },
      { $match: query },
      {
        $project: {
          user: 1,
          image: { $first: "$images" },
          item: 1,
          name: 1,
          accepted: 1,
          received: 1,
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
