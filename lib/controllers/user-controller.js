import dbConnect from "../dbConnect";
import User from "../models/User";
import Verification from "../models/Verification";
import { compare, hash } from "bcrypt";
import mongoose from "mongoose";
import { renderToStaticMarkup } from "react-dom/server";
import VerificationTemplate from "../../utils/email/templates/verification-template";
import { generateAvatarFromInitial } from "../../utils/avatar-utils";
import { upload } from "../../utils/cloudinary-utils";
import crypto from "crypto";
import { sendEmail } from "../../utils/email/email-utils";
import Item from "../models/Item";
import Offer from "../models/Offer";
import Review from "../models/Review";

/**
 *
 * @param {String} firstName - user's first name
 * @param {String} lastName - user's last name
 * @param {String} email - user's email
 * @param {String} password - user's password
 * @param {String} originUrl - the base url of the application
 */

export async function register(firstName, lastName, email, password, origin) {
  await dbConnect();
  try {
    const userExists = await User.exists({
      email,
    }).exec();

    if (userExists) {
      let error = new Error("Email already in use");
      error.name = "EmailError";
      throw error;
    }

    // creates user
    const _id = new mongoose.Types.ObjectId();
    const avatar = await generateAvatarFromInitial(firstName.charAt(0));
    const uploadResult = await upload(`ebarteryan/users/${_id}`, [avatar]);
    const hashedPassword = await hash(password, 10);

    if (uploadResult?.length) {
      const newUser = new User({
        _id,
        image: uploadResult[0],
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verified: false,
      });

      await newUser.save();

      // creates verification
      const token = crypto.randomBytes(32).toString("hex");
      const link = `${origin}/verify?token=${token}`;
      const verification = new Verification({
        userId: _id,
        email,
        token,
      });

      await verification.save();

      // send email
      await sendEmail(
        "noreply <noreply.ebarteryan@gmail.com>",
        email,
        "Account Verification",
        "",
        renderToStaticMarkup(
          <VerificationTemplate
            receiverName={firstName}
            verificationLink={link}
          />
        )
      );

      return {
        id: _id,
        firstName,
        lastName,
        email,
        image: { id: uploadResult[0].id, url: uploadResult[0].url },
      };
    }
  } catch (error) {
    throw error;
  }
}

export async function signIn(email, password) {
  await dbConnect();
  try {
    const user = await User.findOne({ email }).lean({ virtuals: true }).exec();

    if (!user) {
      let error = new Error("Can't find user");
      error.name = "UserError";
      throw error;
    }

    if (user.password) {
      const isValid = await compare(password, user.password); // checks if password is valid
      if (isValid) {
        const { password, ...userData } = user;
        return userData;
      } else {
        let error = new Error("Password Incorrect");
        error.name = "PasswordError";
        throw error;
      }
    } else {
      let error = new Error("Password Incorrect");
      error.name = "PasswordError";
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

export async function verify(token) {
  await dbConnect();
  try {
    const verification = await Verification.findOne({ token });

    if (!verification) {
      let error = new Error("no token found or token is invalid");
      error.name = "TokenError";
      throw error;
    }

    await User.findOneAndUpdate(
      { _id: verification.userId },
      { verified: true }
    );

    await Verification.findByIdAndDelete(verification.id);

    return { message: "user verified" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function handleGoogleAuth(firstName, lastName, email, image) {
  await dbConnect();
  try {
    const existingUser = await User.findOne({ email })
      .select("-password")
      .lean()
      .exec();

    if (existingUser) {
      if (!existingUser.verified) {
        await User.findOneAndUpdate(
          { email: existingUser.email },
          {
            verified: true,
          }
        );
        return;
      }
      return;
    }

    const id = new mongoose.Types.ObjectId();
    const newUser = new User({
      _id: id,
      image: { id, url: image },
      firstName,
      lastName,
      email,
      verified: true,
    });

    await newUser.save();
    return;
    // return {
    //   id,
    //   image: { id, url: image },
    //   firstName,
    //   lastName,
    //   email,
    //   verified: true,
    // };
  } catch (error) {
    throw error;
  }
}

export async function getUserInfo(userId) {
  await dbConnect();
  try {
    // const user = await User.findOne(query).select("-password").lean().exec();

    const userAggregate = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
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
        $lookup: {
          from: Review.collection.name,
          localField: "_id",
          foreignField: "user",
          let: { user_id: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$$user_id", "$user"] } } },
            {
              $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                weightedAverage: { $avg: "$rate" },
                rates: {
                  $push: {
                    rate: "$rate",
                    count: { $sum: 1 },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalReviews: 1,
                weightedAverage: 1,
                rates: {
                  $arrayToObject: {
                    $map: {
                      input: "$rates",
                      as: "rate",
                      in: [
                        { $toString: "$$rate.rate" },
                        {
                          count: "$$rate.count",
                          percentage: {
                            $multiply: [
                              { $divide: ["$$rate.count", "$totalReviews"] },
                              100,
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
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
          image: 1,
          reviews: { $first: "$reviews" },
          offers: {
            $ifNull: [{ $first: "$offers" }, { count: 0 }],
          },
          barteredItems: {
            $ifNull: [{ $first: "$barteredItems" }, { count: 0 }],
          },
        },
      },
    ]);

    if (!userAggregate[0]) {
      let error = new Error("User does not exist");
      error.name = "UserError";
      throw error;
    }

    return userAggregate[0];
  } catch (error) {
    throw error;
  }
}

export async function getSavedItems(user, page, limit) {
  await dbConnect();
  try {
    const data = await User.paginateSubDocs(
      { _id: user },
      {
        select: "savedItems",
        pagingOptions: {
          populate: {
            path: "savedItems",
            select: "name exchangeFor images ended available",
            model: Item,
          },
          ...(page && limit ? { page, limit } : {}),
        },
      }
    );

    return { docs: data.savedItems.docs, totalDocs: data.savedItems.totalDocs };
  } catch (error) {
    throw error;
  }
}

export async function addToSavedList(user, item) {
  await dbConnect();
  try {
    await User.findOneAndUpdate(user, { $addToSet: { savedItems: item } });

    return { saved: true };
  } catch (error) {
    throw error;
  }
}

export async function removeItemFromSaved(user, item) {
  await dbConnect();
  try {
    await User.findOneAndUpdate(user, { $pull: { savedItems: item } });

    return { saved: true };
  } catch (error) {
    throw error;
  }
}
