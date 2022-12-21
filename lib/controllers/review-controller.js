import dbConnect from "../dbConnect";
import Review from "../models/Review";
import Offer from "../models/Offer";
import mongoose from "mongoose";
import Item from "../models/Item";
import User from "../models/User";

export async function submitReview(reviewer, reviewee, item, rate, review) {
  try {
    await dbConnect();

    const reviewExists = await Review.findOne({
      reviewer,
      reviewee,
      item,
    }).exec();

    if (reviewExists) {
      let reviewError = new Error("Review already exists");
      reviewError.name = "ReviewError";
      throw reviewError;
    }

    const newReview = new Review({
      reviewer,
      reviewee,
      item,
      rate,
      review,
    });

    await newReview.save();

    await Offer.findOneAndUpdate(
      {
        $and: [{ item }, { reviewee }],
      },
      { received: true },
      { new: true }
    );

    return newReview;
  } catch (error) {
    throw error;
  }
}

export async function getUserReviewInfo(user) {
  await dbConnect();
  try {
    const reviewCount = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(user) } },
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

export async function getReviews(user, page, limit) {
  await dbConnect();
  try {
    let reviews;
    const reviewsAggregate = Review.aggregate([
      {
        $match: {
          $and: [
            { reviewee: mongoose.Types.ObjectId(user) },
            { review: { $ne: "" } },
          ],
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
