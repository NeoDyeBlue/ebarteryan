import dbConnect from "../dbConnect";
import { errorResponse, successResponse } from "../../utils/response-utils";
import User from "../models/User";
import { compare, hash } from "bcrypt";
import mongoose from "mongoose";
import { renderToStaticMarkup } from "react-dom/server";
import VerificationTemplate from "../../utils/email/templates/verification-template";
import { generateAvatarFromInitial } from "../../utils/avatar-utils";
import { uploadImage } from "../../utils/cloudinary-utils";

export async function signUp(firstName, lastName, email, password) {
  await dbConnect();
  try {
    const userExists = await User.exists({
      email,
    }).exec();

    if (userExists) {
      throw new Error("Email already in use");
    }

    const id = new mongoose.Types.ObjectId();
    const avatar = await generateAvatarFromInitial(firstName.charAt(0));
    const { imageId, imageUrl } = uploadImage(`ebarteryan/users/${id}`, avatar);
    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      _id: id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verified: false,
      image: { id: imageId, url: imageUrl },
    });

    await newUser.save();
  } catch (error) {
    throw error;
  }
}
