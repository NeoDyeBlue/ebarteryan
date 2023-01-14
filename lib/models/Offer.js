import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const offerSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    name: { type: String, trim: true, required: true },
    description: { type: String, required: true, trim: true },
    accepted: { type: Boolean, default: false },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    edited: { type: Boolean, default: false },
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
    condition: {
      type: String,
      required: true,
      enum: ["new", "old", "slightly used", "mostly used", "broken"],
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    received: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.index({ location: "2dsphere" });
offerSchema.plugin(mongoosePaginate);
offerSchema.plugin(aggregatePaginate);

export default mongoose.models.Offer || mongoose.model("Offer", offerSchema);
