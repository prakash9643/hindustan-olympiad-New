import mongoose, { Schema, models } from "mongoose";

const MockTestRequestSchema = new Schema(
  {
    Studentname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    class: { type: String, required: true },
    stream: { type: String },
    schoolName: { type: String, required: true },
    region: { type: String, required: true },
    district: { type: String, required: true },
    otpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MockTestRequest =
  models.MockTestRequest ||
  mongoose.model("MockTestRequest", MockTestRequestSchema);
