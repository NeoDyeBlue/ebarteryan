import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const itemSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    exchangeFor: { type: String, required: true, trim: true },
    draft: { type: Boolean, default: false },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    duration: {
      days: { type: Number, required: true },
      endDate: { type: Date, required: true },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    region: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    claimingOptions: [
      {
        type: String,
        required: true,
        enum: ["meetup", "delivery", "undecided"],
      },
    ],
    condition: {
      type: String,
      required: true,
      enum: ["new", "old", "slightly used", "mostly used", "broken"],
    },
  },
  {
    collation: { locale: "en", strength: 2 },
    timestamps: true,
  }
);

itemSchema.index({ location: "2dsphere" });
itemSchema.plugin(mongoosePaginate);

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
