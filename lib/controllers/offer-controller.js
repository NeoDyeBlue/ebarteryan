import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import Item from "../models/Item";
import { upload } from "../../utils/cloudinary-utils";
import mongoose from "mongoose";
import User from "../models/User";

export async function offer({
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
    const itemFound = await Item.findOne({ item }).exec();

    if (!itemFound) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

    const offerExists = await Offer.findOne({
      $and: [{ user }, { item }],
    }).exec();

    if (offerExists) {
      let offerError = new Error("An offer already exists");
      offerError.name = "OfferError";
      throw offerError;
    }

    const _id = new mongoose.Types.ObjectId();
    const uploads = await upload(`ebarteryan/offers/${item}/${_id}`, images);

    const newOffer = new Offer({
      _id,
      item,
      user,
      name,
      images: uploads,
      description,
      condition,
      region: location.region,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
    });

    await newOffer.save();

    const offer = await Offer.findById(_id)
      .populate("user", "firstName lastName fullName image", User)
      .exec();

    const totalDocs = await Offer.countDocuments({ item });

    return { docs: [offer], totalDocs };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getItemOffers(item, user, page, limit) {
  await dbConnect();
  try {
    const itemFound = await Item.findById(item).exec();
    if (!itemFound) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

    const offers = await Offer.paginate(
      { ...(user ? { $and: [{ item }, { user: { $ne: user } }] } : { item }) },
      // { item },
      {
        ...(page && limit ? { page, limit } : {}),
        populate: {
          path: "user",
          select: "firstName lastName fullName image",
          model: User,
        },
      }
    );

    const totalDocs = await Offer.countDocuments({ item });

    return { docs: offers.docs, totalDocs };
  } catch (error) {
    throw error;
  }
}

export async function getUserOffer(item, user) {
  await dbConnect();
  try {
    const itemFound = await Item.findById(item).exec();
    if (!itemFound) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

    await Offer.findOne({ $and: [{ item }, { user }] });

    const offerData = await Offer.findOne({ $and: [{ item }, { user }] })
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
        $and: [{ user: mongoose.Types.ObjectId(user) }, { accepted: true }],
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
            { $unwind: "$user" },
            {
              $project: {
                name: 1,
                _id: 1,
                user: 1,
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
