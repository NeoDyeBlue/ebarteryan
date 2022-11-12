import dbConnect from "../dbConnect";
import Item from "../models/Item";
import mongoose from "mongoose";
import { upload } from "../../utils/cloudinary-utils";
import Category from "../models/Category";

/**
 * @todo If there is an error and do a reupload clear folder
 * @param {Object} - the form body
 */

export async function addItem({
  user,
  name,
  images,
  description,
  exchangeFor,
  duration,
  customDuration,
  category,
  location,
  claimingOptions,
  condition,
}) {
  await dbConnect();
  try {
    const _id = new mongoose.Types.ObjectId();
    const uploads = await upload(`ebarteryan/items/${_id}`, images);

    const item = new Item({
      user,
      name,
      images: uploads,
      description,
      exchangeFor,
      duration:
        duration === "custom" && customDuration ? customDuration : duration,
      category,
      region: location.region,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
      claimingOptions,
      condition,
    });

    await item.save();

    return { _id };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getItem(category, item) {
  await dbConnect();
  try {
    const categoryData = await Category.findOne({ name: category })
      .select("_id")
      .exec();
    if (!categoryData) {
      let categoryError = new Error("Category not found");
      categoryError.name = "CategoryError";
      throw categoryError;
    }

    const itemData = await Item.findOne({
      $and: [{ category: categoryData._id }, { _id: item }],
    })
      .populate("category")
      .lean()
      .exec();

    if (!itemData) {
      let itemError = new Error("Item not found");
      itemError.name = "ItemError";
      throw itemError;
    }

    return itemData;
  } catch (error) {
    throw error;
  }
}

export async function getUserItems(userId, draftsOnly) {
  await dbConnect();
  try {
    const items = await Item.find({
      $and: [{ user: userId }, { drafts: draftsOnly }],
    })
      .populate("category")
      .lean()
      .exec();

    return items;
  } catch (error) {
    throw error;
  }
}

export async function getItems(
  userId,
  category,
  { page, limit, createdBefore, lat, lng, radius }
) {
  await dbConnect();
  try {
    const filteredQuery = {
      ...(createdBefore
        ? { createdAt: { $lte: new Date(Number(createdBefore)) } }
        : {}),
      ...(lat && lng && radius
        ? {
            location: {
              $geoWithin: {
                $centerSphere: [[lng, lat], radius / 1.609 / 3963.2], // radius / miles / earth radius
              },
            },
          }
        : {}),
      ...(userId ? { user: { $ne: userId } } : {}),
    };

    const arrayQuery = Object.keys(filteredQuery).map((key) => ({
      [key]: filteredQuery[key],
    }));
    const options = {
      ...(page && limit ? { page, limit } : {}),
      populate: {
        path: "category",
      },
    };
    if (!category || category == "all") {
      const result = await Item.paginate(
        { ...(arrayQuery.length ? { $and: arrayQuery } : {}) },
        options
      );
      return result.docs;
    } else {
      const categoryItem = await Category.findOne({ name: category }).exec();
      if (categoryItem) {
        const result = await Item.paginate(
          { $and: [...arrayQuery, { category: categoryItem._id }] },
          options
        );
        return result.docs;
      } else {
        let error = new Error("Category not found");
        error.name = "CategoryError";
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
}
