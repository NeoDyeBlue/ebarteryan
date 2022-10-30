import mongoose from "mongoose";

const verificationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true, unique: true, trim: true },
  token: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now, expires: "1d" },
});

// 86400 1d

export default mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);
