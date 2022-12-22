import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const conversationSchema = mongoose.Schema(
  {
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    latestChat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

conversationSchema.plugin(mongoosePaginate);
conversationSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
