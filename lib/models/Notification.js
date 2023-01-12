import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const notificationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: {
      type: String,
      required: true,
      enum: ["offer", "offer-accepted", "question", "item-ended", "answer"],
    },
    read: { type: Boolean, default: false },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  },
  { timestamps: true }
);

notificationSchema.plugin(mongoosePaginate);
notificationSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
