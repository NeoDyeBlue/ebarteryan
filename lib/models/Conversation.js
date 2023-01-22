import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: [
        new mongoose.Schema({
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          read: { type: Boolean, default: false },
        }),
      ],
      max: 2,
    },
    latestChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
  },
  { timestamps: true }
);

conversationSchema.plugin(mongoosePaginate);
conversationSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
