import dbConnect from "../dbConnect";
import Offer from "../models/Offer";
import Item from "../models/Item";
import { upload } from "../../utils/cloudinary-utils";
import mongoose from "mongoose";

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

    const offerExists = await Offer.findOne({ user }).exec();

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

    const offer = Offer.findById(_id)
      .populate("user", "firstName lastName fullName image")
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
    const itemFound = await Item.findById(item).exec();
    if (!itemFound) {
      let itemError = new Error("Item does not exist");
      itemError.name = "ItemError";
      throw itemError;
    }

    const offers = await Offer.paginate(
      { ...(user ? { $and: [{ item }, { user: { $ne: user } }] } : { item }) },
      {
        ...(page && limit ? { page, limit } : {}),
        populate: { path: "user", select: "firstName lastName fullName image" },
      }
    );

    return offers;
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
      .populate("user", "firstName lastName fullName image")
      .exec();

    return offerData;
  } catch (error) {
    throw error;
  }
}
