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
    let query = { user };
    let approach = "default";
    let offers;

    if (status == "pending") {
      query = {
        $and: [
          { user: user },
          {
            item: { duration: { endDate: { $lt: ["endDate", new Date()] } } },
          },
          { accepted: false },
        ],
      };
      approach = "aggregate";
    } else if (status == "failed") {
      query = {
        $and: [
          { user: user },
          { item: { "duration.endDate": { $gt: new Date() } } },
          { accepted: false },
        ],
      };
      approach = "aggregate";
    } else if (status == "accepted") {
      query = {
        $and: [{ user: user }, { accepted: true }],
      };
    }

    if (approach == "aggregate") {
      const offersAggregate = await Offer.aggregate([
        {
          $lookup: {
            from: Item.collection.name,
            localField: "item",
            foreignField: "_id",
            as: "items",
          },
        },
        // { $unwind: "$items" },
        { $project: query },
      ]);

      offers = await Offer.aggregatePaginate(offersAggregate, {
        ...(page && limit ? { page, limit } : {}),
        populate: [
          {
            path: "item",
            select: "images name createdAt user duration",
            model: Item,
            populate: {
              path: "user",
              select: "firstName lastName fullName image",
              model: User,
            },
          },
        ],
        select: "name images accepted createdAt",
      });
    } else {
      offers = await Offer.paginate(
        query,
        // { item },
        {
          ...(page && limit ? { page, limit } : {}),
          populate: [
            {
              path: "item",
              select: "images name createdAt user duration",
              model: Item,
              populate: {
                path: "user",
                select: "firstName lastName fullName image",
                model: User,
              },
            },
          ],
          select: "name images accepted createdAt",
        }
      );
    }
    // console.log(offers);

    return { docs: offers.docs, totalDocs: offers.totalDocs };
  } catch (error) {
    throw error;
  }
}
