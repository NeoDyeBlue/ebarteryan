import dbConnect from "../dbConnect";
import Review from "../models/Review";
import Offer from "../models/Offer";
import mongoose from "mongoose";
import Item from "../models/Item";
import User from "../models/User";
import errorThrower from "../../utils/error-utils";

/**
 * Creates a user review
 * @param {String} reviewer - the user that made the review
 * @param {String} user - the user who is subject to review
 * @param {String} item
 * @param {Number} rate
 * @param {String} review
 * @returns
 */

export async function submitReview(reviewer, user, item, rate, review) {
  try {
    await dbConnect();

    const reviewExists = await Review.findOne({
      user,
      reviewer,
      item,
    }).exec();

    if (reviewExists) {
      throw errorThrower("ReviewError", "Review already exists");
    }

    const newReview = new Review({
      user,
      reviewer,
      item,
      rate,
      review,
    });

    await newReview.save();

    await Offer.findOneAndUpdate(
      {
        $and: [{ item }, { reviewer }],
      },
      { reviewed: true },
      { new: true }
    );

    return newReview;
  } catch (error) {
    throw error;
  }
}

/**
 * gets the review infromation of a uaser
 * @param {String} user
 * @returns
 * @todo make it like the one from the item/offers controller
 */

export async function getUserReviewInfo(user) {
  await dbConnect();
  try {
    const reviewCount = await Review.aggregate([
      { $match: { user: mongoose.Types.ObjectId(user) } },
      //   { $count: "reviews" },
      {
        $group: {
          _id: "$rate",
          //   rate: "$rate",
          count: { $sum: 1 },
        },
      },
    ]);

    let rates = {};

    const totalReviews = reviewCount?.length
      ? reviewCount.reduce((a, b) => a + b.count, 0)
      : 0;

    for (let i = 0; i < 5; i++) {
      let countData =
        reviewCount?.length &&
        reviewCount.find((count) => Number(count._id) == i + 1);
      if (countData) {
        rates[i + 1] = {
          count: countData.count,
          percentage:
            countData.count > 0 ? (totalReviews / countData.count) * 100 : 0,
        };
      } else {
        rates[i + 1] = { count: 0, percentage: 0 };
      }
    }

    const weightedAverage =
      (5 * rates["5"].count +
        4 * rates["4"].count +
        3 * rates["3"].count +
        2 * rates["2"].count +
        1 * rates["1"].count) /
      totalReviews;

    // console.log((totalReviews / rates["4"]) * 100);

    return { user, totalReviews, weightedAverage, rates };
  } catch (error) {
    throw error;
  }
}

/**
 * gets all the reviews of a user with pagination
 * @param {String} user
 * @param {Number} page
 * @param {Number} limit
 * @returns
 */

export async function getReviews(user, page, limit) {
  await dbConnect();
  try {
    let reviews;
    const reviewsAggregate = Review.aggregate([
      {
        $match: {
          $and: [{ user: mongoose.Types.ObjectId(user) }],
        },
      },
      {
        $lookup: {
          from: Item.collection.name,
          localField: "item",
          foreignField: "_id",
          let: { item_id: "$item" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$item_id", "$_id"] } } },
            {
              $project: {
                name: 1,
                _id: 1,
                createdAt: 1,
                image: { $first: "$images" },
              },
            },
          ],
          as: "item",
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          localField: "reviewer",
          foreignField: "_id",
          let: { reviewer_id: "$reviewer" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$reviewer_id", "$_id"] } } },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                image: 1,
                _id: 1,
                createdAt: 1,
              },
            },
          ],
          as: "reviewer",
        },
      },
      { $unwind: "$item" },
      { $unwind: "$reviewer" },
      {
        $project: {
          reviewer: 1,
          review: 1,
          item: 1,
          rate: 1,
          createdAt: 1,
        },
      },
    ]);

    reviews = await Review.aggregatePaginate(reviewsAggregate, {
      ...(page && limit ? { page, limit } : {}),
    });

    return { docs: reviews.docs, totalDocs: reviews.totalDocs };
  } catch (error) {
    throw error;
  }
}
