import mongoose from "mongoose";
import crypto from "crypto";

const passwordResetSchema = mongoose.Schema({
  email: { type: String, required: true },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

passwordResetSchema.pre("save", function (next) {
  this.resetToken = crypto
    .createHash("sha256")
    .update(this.resetToken)
    .digest("hex");
  next();
});

export default mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", passwordResetSchema);
