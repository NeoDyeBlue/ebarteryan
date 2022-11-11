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

    console.log(verification);

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

export async function getUserInfo(query) {
  await dbConnect();
  try {
    const user = await User.findOne(query).select("-password").lean().exec();

    if (!user) {
      let error = new Error("User does not exist");
      error.name = "UserError";
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
}
