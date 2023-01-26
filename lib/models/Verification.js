import mongoose from "mongoose";

const verificationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true, unique: true, trim: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

// verificationSchema.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 120 })

// 86400 1d

export default mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);
