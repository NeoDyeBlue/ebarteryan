import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    toJSON: { virtuals: true },
  }
);

categorySchema.virtual("items", {
  ref: "item",
  foreignField: "category",
  localField: "_id",
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
