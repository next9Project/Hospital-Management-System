// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema({
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
//   date: { type: Date, required: true },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "cancelled", "completed"],
//     default: "pending",
//   },
//   notes: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);




import mongoose from "mongoose"; 


const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    date: {
      type: Date,
    },
    day: String,
    timeSlot: String,
    appointmentType: String,
    notes: {
      type: String,
      default: "",
    },
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


// Add indexes
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ doctorId: 1, date: 1 });

module.exports = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);