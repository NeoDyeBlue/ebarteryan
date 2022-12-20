import dbConnect from "../dbConnect";
import Review from "../models/Review";
import Offer from "../models/Offer";
import mongoose from "mongoose";

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
      (5 * rates["5"] +
        4 * rates["4"] +
        3 * rates["3"] +
        2 * rates["2"] +
        1 * rates["1"]) /
      totalReviews;

    // console.log((totalReviews / rates["4"]) * 100);

    return { user, totalReviews, weightedAverage, rates };
  } catch (error) {
    throw error;
  }
}
