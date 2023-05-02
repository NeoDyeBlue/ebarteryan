import dbConnect from "../dbConnect";
import Category from "../models/Category";

export async function getAllCategories() {
  await dbConnect();
  try {
    const categories = await Category.find().exec();
    return categories;
  } catch (error) {
    throw error;
  }
}
