import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  exchangeFor: { type: String, required: true, trim: true },
  images: [
    {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  condition: {
    type: String,
    required: true,
    enum: ["new", "old", "slightly_used", "mostly_used", "broken"],
  },
});

// 86400 1d

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
