import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const offerSchema = mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    description: { type: String, required: true, trim: true },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
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
    condition: {
      type: String,
      required: true,
      enum: ["new", "old", "slightly_used", "mostly_used", "broken"],
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.index({ location: "2dsphere" });
offerSchema.plugin(mongoosePaginate);

export default mongoose.models.Offer || mongoose.model("Offer", offerSchema);
