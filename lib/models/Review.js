import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rate: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5,
  },
  message: {
    type: String,
    trim: true,
  },
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
