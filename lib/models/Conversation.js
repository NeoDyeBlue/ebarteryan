import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const conversationSchema = mongoose.Schema(
  {
    members: [
      new mongoose.Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        read: { type: Boolean, default: false },
      }),
    ],
    latestChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

conversationSchema.plugin(mongoosePaginate);
conversationSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
