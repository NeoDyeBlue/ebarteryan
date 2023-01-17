import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    password: { type: String, trim: true },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
    savedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    verified: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    getters: true,
    virtuals: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    collation: { locale: "en", strength: 2 },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.plugin(mongooseLeanVirtuals);
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);

export default mongoose.models.User || mongoose.model("User", userSchema);
