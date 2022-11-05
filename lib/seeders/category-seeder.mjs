import Category from "../models/Category.js";

const categories = [
  {
    name: "appliances",
  },
  {
    name: "automotive",
  },
  {
    name: "clothings",
  },
  {
    name: "electronics",
  },
  {
    name: "furnitures",
  },
  {
    name: "groceries",
  },
  {
    name: "plants",
  },
  {
    name: "others",
  },
];

export default async function categorySeeder() {
  try {
    const dataCount = await Category.count().exec();

    if (dataCount == 0) {
      await Category.insertMany(categories);
    }
    return;
  } catch (error) {
    throw error;
  }
}
