import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const questionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    edited: { type: Boolean, default: false },
    question: { type: String, trim: true, required: true },
    answer: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

questionSchema.plugin(mongoosePaginate);
questionSchema.plugin(aggregatePaginate);

export default mongoose.models.Question ||
  mongoose.model("Question", questionSchema);
