import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const chatSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
    body: { type: String, required: true },
    images: [
      {
        id: { type: String },
        url: { type: String },
      },
    ],
    type: {
      type: String,
      required: true,
      enum: ["text", "image", "offer", "mixed"],
    },
  },
  { timestamps: true }
);

chatSchema.plugin(mongoosePaginate);
chatSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
