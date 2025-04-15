import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "doctor", "nurse", "patient"],
      required: true,
    },
    phone: { type: String },
    address: { type: String },
    profileImage: { type: String, default: null },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);


