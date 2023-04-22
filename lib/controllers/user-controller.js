import dbConnect from "../dbConnect";
import User from "../models/User";
import Verification from "../models/Verification";
import { compare, hash } from "bcrypt";
import mongoose from "mongoose";
import { renderToStaticMarkup } from "react-dom/server";
import VerificationTemplate from "../../utils/email/templates/verification-template";
import PasswordResetTemplate from "../../utils/email/templates/password-reset-template";
import { generateAvatarFromInitial } from "../../utils/avatar-utils";
import { destroy, upload } from "../../utils/cloudinary-utils";
import crypto from "crypto";
import { sendEmail } from "../../utils/email/email-utils";
import Item from "../models/Item";
import Offer from "../models/Offer";
import Review from "../models/Review";
import PasswordReset from "../models/PasswordReset";
import totp from "totp-generator";
import errorThrower from "../../utils/error-utils";

/**
 *
 * @param {String} firstName - user's first name
 * @param {String} lastName - user's last name
 * @param {String} email - user's email
 * @param {String} password - user's password
 * @param {String} originUrl - the base url of the application
 */

export async function register(firstName, lastName, email, password) {
  await dbConnect();
  try {
    const userExists = await User.exists({
      email,
    }).exec();

    if (userExists) {
      throw errorThrower("EmailError", "Email already in use");
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
      const otp = totp(process.env.TOTP_KEY, {
        period: 900,
      });
      const verification = new Verification({
        user: _id,
        email,
        otp,
      });

      await verification.save();

      // send email
      await sendEmail(
        "noreply <noreply.ebarteryan@gmail.com>",
        email,
        "Account Verification",
        "",
        renderToStaticMarkup(
          <VerificationTemplate receiverName={firstName} otp={otp} />
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

/**
 * Sign in / Login a user
 * @param {String} email
 * @param {String} password
 * @returns
 */

export async function signIn(email, password) {
  await dbConnect();
  try {
    const user = await User.findOne({ email }).lean({ virtuals: true }).exec();

    if (!user) {
      throw errorThrower("UserError", "Can't find the user");
    }

    if (user.password) {
      const isValid = await compare(password, user.password); // checks if password is valid
      if (isValid) {
        const { password, ...userData } = user;
        return userData;
      } else {
        throw errorThrower("PasswordError", "Password incorrect");
      }
    } else {
      throw errorThrower("PasswordError", "Password incorrect");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Resends the verification email to the user
 * @param {String} user
 * @returns
 */

export async function verificationResend(user) {
  await dbConnect();
  try {
    const userData = await User.findById(user)
      .select("email verified firstName")
      .exec();

    if (!userData) {
      throw errorThrower("UserError", "user cannot be found");
    } else if (userData && userData.verified) {
      throw errorThrower("UserError", "user already verified");
    }

    const otp = totp(process.env.TOTP_KEY, {
      period: 900,
    });

    await Verification.findOneAndUpdate(
      { user },
      {
        otp,
        user,
        email: userData?.email,
        $currentDate: { expireAt: true },
      },
      { upsert: true }
    );

    // send email
    await sendEmail(
      "noreply <noreply.ebarteryan@gmail.com>",
      userData?.email,
      "Account Verification",
      "",
      renderToStaticMarkup(
        <VerificationTemplate receiverName={userData.firstName} otp={otp} />
      )
    );

    return { message: "verification resent" };
  } catch (error) {
    throw error;
  }
}

/**
 * verifies the user through the otp provided
 * @param {String} email
 * @param {String} otp
 * @returns
 */

export async function verify(email, otp) {
  await dbConnect();
  try {
    const verification = await Verification.findOne({ email, otp });

    if (!verification) {
      throw errorThrower("TokenError", "Incorrect or OTP expired");
    }

    const verifiedUser = await User.findOneAndUpdate(
      { _id: verification.user },
      { verified: true },
      { new: true, select: "verified" }
    );

    await Verification.findByIdAndDelete(verification.id);

    return { verified: verifiedUser.verified };
  } catch (error) {
    throw error;
  }
}

/**
 * for google authentication
 * @param {String} firstName
 * @param {String} lastName
 * @param {String} email
 * @param {String} image
 * @returns
 */

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

/**
 * gets a user information
 * @param {String} userId
 * @returns
 */

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
          _id: {
            $toString: "$_id",
          },
          firstName: 1,
          lastName: 1,
          createdAt: 1,
          image: 1,
          verified: 1,
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
      throw errorThrower("UserError", "Can't find user");
    }

    return userAggregate[0];
  } catch (error) {
    throw error;
  }
}

/**
 * gets the user's saved items with pagination
 * @param {String} user
 * @param {Number} page
 * @param {Number} limit
 * @returns
 */

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

/**
 * adds an item to the user's saved list
 * @param {String} user
 * @param {String} item
 * @returns
 */

export async function addToSavedList(user, item) {
  await dbConnect();
  try {
    const saved = await User.findOne({
      _id: user,
      savedItems: { $in: [item] },
    });

    if (saved) {
      await User.findByIdAndUpdate(user, { $pull: { savedItems: item } });
    } else {
      await User.findByIdAndUpdate(user, { $addToSet: { savedItems: item } });
    }

    return { saved: saved ? false : true };
  } catch (error) {
    throw error;
  }
}

/**
 * removes an item to the user's saved list
 * @param {String} user
 * @param {String} item
 * @returns
 */

export async function removeItemFromSaved(user, item) {
  await dbConnect();
  try {
    await User.findByIdAndUpdate(user, { $pull: { savedItems: item } });

    return { saved: false };
  } catch (error) {
    throw error;
  }
}

/**
 * updates the user profile
 * @param {String} userId
 * @param {Object} values
 * @returns
 */

export async function updateProfile(userId, values) {
  await dbConnect();
  try {
    const userData = await User.findById(userId);

    if (!userData) {
      throw errorThrower("UserError", "User cannot be found");
    }

    if (userData.image.url !== values.image) {
      if (userData.image.cloudId) {
        await destroy([userData.image.cloudId]);
      }
      const newImage = await upload(`/ebarteryan/users/${userData._id}`, [
        values.image,
      ]);
      values.image = newImage[0];
    }

    const updatedProfile = await User.findByIdAndUpdate(userId, values, {
      new: true,
      select: "firstName lastName image",
    }).exec();

    return updatedProfile;
  } catch (error) {
    throw error;
  }
}

/**
 * sends an email for password resets
 * @param {String} email
 * @param {String} origin
 * @param {Boolean} resend
 * @returns
 */

export async function sendPasswordResetRequest(email, origin, resend = false) {
  await dbConnect();
  try {
    await PasswordReset.findOneAndDelete({ email }).exec();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw errorThrower("UserError", "Cannot find account");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const link = `${origin}/password/new?token=${resetToken}`;

    const newPasswordReset = new PasswordReset({
      email,
      resetToken,
    });

    await newPasswordReset.save();

    await sendEmail(
      "noreply <noreply.ebarteryan@gmail.com>",
      email,
      "Password Reset",
      "",
      renderToStaticMarkup(
        <PasswordResetTemplate receiverName={user.firstName} resetLink={link} />
      )
    );
    return { message: "password reset request sent" };
  } catch (error) {
    throw error;
  }
}

/**
 * updates or resets the user's password
 * @param {String} token
 * @param {String} newPassword
 * @returns
 */

export async function resetPassword(token, newPassword) {
  await dbConnect();
  try {
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const passwordReset = await PasswordReset.findOne({
      resetToken: hashedResetToken,
    }).exec();

    if (!passwordReset) {
      throw errorThrower("TokenError", "Invalid token");
    }

    const newHashedPassword = await hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: passwordReset.email },
      { password: newHashedPassword }
    ).exec();

    await passwordReset.remove();

    return { message: "password updated" };
  } catch (error) {
    throw error;
  }
}

/**
 * used if user is logged in and wants to change his/her password
 * from the account settings
 * @param {String} user
 * @param {Object} passwords
 * @returns
 */

export async function changeAccountPassword(user, passwords) {
  await dbConnect();
  try {
    const userData = await User.findById(user).select("password").exec();
    const isExactPassword = await compare(
      passwords.oldPassword,
      userData.password
    );

    if (!isExactPassword) {
      throw errorThrower("PasswordError", "Incorrect password");
    }

    const hashedNewPassword = await hash(passwords.newPassword, 10);

    await User.findByIdAndUpdate(userData._id, {
      password: hashedNewPassword,
    });

    return { message: "Password changed" };
  } catch (error) {
    throw error;
  }
}
