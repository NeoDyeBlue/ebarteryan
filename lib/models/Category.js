import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    otherFields: [
      {
        name: { type: String, trim: true, required: true, unique: true },
        type: {
          type: String,
          enum: ["text", "number", "dropdown"],
          required: true,
        },
        isRequired: { type: Boolean, default: false },
        selectionItems: [{ type: String, trim: true }],
      },
    ],
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
