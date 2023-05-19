import dbConnect from "../dbConnect";
import Category from "../models/Category";
import Item from "../models/Item";
import errorThrower from "../../utils/error-utils";

export async function getAllCategories() {
  await dbConnect();
  try {
    const categories = await Category.find().exec();
    return categories;
  } catch (error) {
    throw error;
  }
}

export async function getCategoryData(name) {
  await dbConnect();
  try {
    const category = await Category.findOne({
      name: { $regex: name.split("+").join(" "), $options: "i" },
    }).exec();

    if (!category) {
      throw errorThrower("CategoryError", "Category not found");
    }

    let filterFields = category?.otherFields?.map((field) => ({
      name: field.name,
      type: field.type,
      values: [],
    }));

    const items = await Item.find({ category: category._id })
      .select("categoryFields")
      .exec();

    items.forEach((item) => {
      if (item?.categoryFields?.length) {
        item.categoryFields.forEach((field) => {
          const filterField = filterFields.find((f) => f.name == field.name);
          if (!filterField.values.includes(field.value)) {
            filterField.values.push(field.value);
          }
          filterFields = [
            ...filterFields.filter((f) => f.name !== field.name),
            filterField,
          ];
        });
      }
    });

    return {
      category,
      filterFields,
    };
  } catch (error) {
    throw error;
  }
}
