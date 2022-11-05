import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
});

// 86400 1d

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
