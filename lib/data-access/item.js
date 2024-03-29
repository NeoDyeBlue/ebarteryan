import dbConnect from "../dbConnect";
import Item from "../models/Item";
import mongoose from "mongoose";
import { upload, destroy, destroyFolder } from "../../utils/cloudinary-utils";
import Category from "../models/Category";
import User from "../models/User";
import Offer from "../models/Offer";
import Review from "../models/Review";
import Notification from "../models/Notification";
import Question from "../models/Question";
import errorThrower from "../../utils/error-utils";

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
  category,
  location,
  claimingOptions,
  condition,
  draft,
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
      category,
      draft,
      region: location.region,
      location: { type: "Point", coordinates: [location.lng, location.lat] },
      claimingOptions,
      condition,
    });

    await item.save();

    return { _id };
  } catch (error) {
    throw error;
  }
}

export async function getItem(item, user) {
  await dbConnect();
  try {
    const itemData = await Item.findById(item).select("user draft").exec();
    if (itemData && itemData.draft && String(itemData.user) != user) {
      throw errorThrower("ItemError", "Cannot get item");
    }

    const userData = await User.findById(user).select("_id").exec();

    const itemAggregate = await Item.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(item) } },
      {
        $lookup: {
          from: Category.collection.name,
          localField: "category",
          foreignField: "_id",
          let: { category_id: "$category" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$category_id", "$_id"] } } },
            { $project: { _id: 1, name: 1 } },
          ],
          as: "category",
        },
      },
      { $unwind: "$category" },
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
                      rating: { $round: ["$rating", 1] },
                    },
                  },
                ],
                as: "reviews",
              },
            },
            {
              $lookup: {
                from: Offer.collection.name,
                localField: "_id",
                foreignField: "user",
                let: { user_id: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$user_id", "$user"] } } },
                  {
                    $group: {
                      _id: "$user",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      count: "$count",
                    },
                  },
                ],
                as: "offers",
              },
            },
            {
              $lookup: {
                from: Item.collection.name,
                localField: "_id",
                foreignField: "user",
                let: { user_id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $and: [
                        { $expr: { $eq: ["$$user_id", "$user"] } },
                        { ended: true },
                      ],
                    },
                  },
                  {
                    $group: {
                      _id: "$user",
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      count: "$count",
                    },
                  },
                ],
                as: "barteredItems",
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                createdAt: 1,
                image: 1,
                reviews: {
                  $ifNull: [{ $first: "$reviews" }, { count: 0, rating: 0 }],
                },
                offers: {
                  $ifNull: [{ $first: "$offers" }, { count: 0 }],
                },
                barteredItems: {
                  $ifNull: [{ $first: "$barteredItems" }, { count: 0 }],
                },
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
      ...(userData
        ? [
            {
              $lookup: {
                from: User.collection.name,
                let: { user_id: mongoose.Types.ObjectId(user) },
                pipeline: [
                  { $match: { $expr: { $eq: ["$$user_id", "$_id"] } } },
                  {
                    $project: {
                      savedItems: {
                        $filter: {
                          input: "$savedItems",
                          as: "item",
                          cond: {
                            $eq: ["$$item", mongoose.Types.ObjectId(item)],
                          },
                        },
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      isSaved: {
                        $gt: [{ $size: "$savedItems" }, 0],
                      },
                    },
                  },
                ],
                as: "requester",
              },
            },
            { $unwind: "$requester" },
          ]
        : []),
      // { $project: { "isSaved": "$user.isSaved" } },
    ]);

    if (!itemAggregate.length) {
      let itemError = new Error("Item not found");
      itemError.name = "ItemError";
      throw itemError;
    }

    return itemAggregate[0];
  } catch (error) {
    throw error;
  }
}

export async function getUserItems(
  userId,
  isInDrafts = false,
  unavailable = false,
  ended = false,
  page,
  limit
) {
  await dbConnect();
  try {
    const itemsAggregate = Item.aggregate([
      {
        $lookup: {
          from: Category.collection.name,
          localField: "category",
          foreignField: "_id",
          let: { category_id: "$category" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$category_id", "$_id"] } } },
            { $project: { _id: 1, name: 1 } },
          ],
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $match: {
          $and: [
            { user: mongoose.Types.ObjectId(userId) },
            { draft: isInDrafts },
            { available: !unavailable },
            // { isRemoved: false },
            { ended },
          ],
        },
      },
      {
        $lookup: {
          from: Offer.collection.name,
          localField: "_id",
          foreignField: "item",
          pipeline: [{ $match: { isRemoved: false } }],
          as: "offers",
        },
      },
      { $addFields: { offersCount: { $size: "$offers" } } },
      {
        $project: {
          _id: 1,
          category: 1,
          name: 1,
          exchangeFor: 1,
          isRemoved: 1,
          violation: 1,
          image: { $first: "$images" },
          offersCount: 1,
        },
      },
    ]);

    const items = await Item.aggregatePaginate(itemsAggregate, {
      ...(page && limit ? { page, limit } : {}),
    });

    return { docs: items.docs, totalDocs: items.totalDocs };
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
      $or: [
        {
          availability: true,
        },
        { ended: false },
      ],
    };

    const arrayQuery = Object.keys(filteredQuery).map((key) => ({
      [key]: filteredQuery[key],
    }));
    const options = {
      ...(page && limit ? { page, limit } : {}),
      populate: {
        path: "category",
        model: Category,
      },
    };
    if (!category || category == "all") {
      const result = await Item.paginate(
        { ...(arrayQuery.length ? { $and: arrayQuery } : {}) },
        options
      );
      return result;
    } else {
      const categoryItem = await Category.findOne({ name: category }).exec();
      if (categoryItem) {
        const result = await Item.paginate(
          { $and: [...arrayQuery, { category: categoryItem._id }] },
          options
        );
        return result;
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

export async function getItemsAggregate(
  userId,
  category = "all",
  { page, limit, created_before, lat, lng, radius, search_query }
) {
  await dbConnect();
  try {
    const filteredQuery = {
      ...(search_query
        ? { name: { $regex: search_query, $options: "i" } }
        : {}),
      ...(created_before
        ? { createdAt: { $lte: new Date(Number(created_before)) } }
        : {}),
      ...(lat && lng && radius
        ? {
            location: {
              $geoWithin: {
                $centerSphere: [
                  [Number(lng), Number(lat)],
                  radius / 1.609 / 3963.2,
                ], // radius / miles / earth radius
              },
            },
          }
        : {}),
      ...(userId ? { user: { $ne: mongoose.Types.ObjectId(userId) } } : {}),
      ...(category && category !== "all" ? { "category.name": category } : {}),
      available: true,
      isRemoved: false,
      ended: false,
      draft: false,
    };

    // console.log(JSON.stringify(filteredQuery));

    const arrayQuery = Object.keys(filteredQuery).map((key) => ({
      [key]: filteredQuery[key],
    }));

    const itemsAggregate = Item.aggregate([
      {
        $lookup: {
          from: Category.collection.name,
          localField: "category",
          foreignField: "_id",
          let: { category_id: "$category" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$category_id", "$_id"] } } },
            { $project: { _id: 1, name: 1 } },
          ],
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $match: { $and: arrayQuery } },
      {
        $lookup: {
          from: Offer.collection.name,
          localField: "_id",
          foreignField: "item",
          pipeline: [{ $match: { isRemoved: false } }],
          as: "offers",
        },
      },
      { $addFields: { offersCount: { $size: "$offers" } } },
      {
        $project: {
          _id: 1,
          category: 1,
          name: 1,
          exchangeFor: 1,
          image: { $first: "$images" },
          offersCount: 1,
          available: 1,
        },
      },
    ]);

    const items = await Item.aggregatePaginate(itemsAggregate, {
      ...(page && limit ? { page, limit } : {}),
    });

    return { docs: items.docs, totalDocs: items.totalDocs };
  } catch (error) {
    throw error;
  }
}

export async function updateItem(user, item, values) {
  await dbConnect();
  try {
    const itemData = await Item.findOne({ user, _id: item })
      .select("images draft")
      .exec();

    if (!itemData) {
      let itemError = new Error("Item not found");
      itemError.name = "ItemError";
      throw itemError;
    }

    if (values.draft && !itemData.draft) {
      values.draft = false;
    }

    if (
      (values?.newImages && values.newImages.length) ||
      (values?.toRemoveImages && values.toRemoveImages.length)
    ) {
      values.images = itemData.images;
      if (values?.newImages && values.newImages.length) {
        const uploads = await upload(
          `ebarteryan/items/${item}`,
          values.newImages
        );
        values.images.push(...uploads);
      }

      if (values?.toRemoveImages && values.toRemoveImages.length) {
        const destroys = await destroy(
          values.toRemoveImages.map((image) => image.cloudId)
        );
        //test this
        values.images = values.images.filter(
          (image) => !destroys.includes(image.cloudId)
        );
      }
    }

    if (!Object.keys(values).includes("available") && !itemData.draft) {
      values.edited = true;
    }

    const updatedItem = await Item.findByIdAndUpdate(item, values, {
      new: true,
      populate: {
        path: "category",
        select: "name",
        model: Category,
      },
    }).exec();

    if (!updatedItem) {
      let itemError = new Error("Item not found");
      itemError.name = "ItemError";
      throw itemError;
    }

    return { category: updatedItem.category.name, item };
  } catch (error) {
    throw error;
  }
}

export async function deleteItem(user, item) {
  await dbConnect();
  try {
    const itemData = await Item.findOne({ user, _id: item }).exec();

    if (!itemData) {
      throw errorThrower("ItemError", "Can't delete item");
    }

    await destroy(itemData?.images?.map((image) => image.cloudId));
    await destroyFolder(`/ebarteryan/items/${itemData._id}`);
    await Item.findByIdAndDelete(item).exec();
    await User.updateMany(
      { savedItems: item },
      { $pull: { savedItems: item } }
    );
    await Notification.deleteMany({ item }).exec();
    await Question.deleteMany({ item }).exec();

    return { message: "Item deleted" };
  } catch (error) {
    throw error;
  }
}
