import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const itemSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    exchangeFor: { type: String, required: true, trim: true },
    draft: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    edited: { type: Boolean, default: false },
    ended: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
    asOffer: { type: Boolean, default: false },
    isAcceptedRemoved: { type: Boolean, default: false },
    violation: { type: String },
    priceValue: { type: Number, required: true },
    images: [
      {
        cloudId: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryFields: [
      {
        name: { type: String, trim: true, required: true, unique: true },
        value: { type: String, trim: true, required: true },
      },
    ],
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
itemSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
