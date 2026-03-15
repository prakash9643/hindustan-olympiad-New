import { Omega } from "lucide-react";
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  otp: { type: String, required: true },
  omrCode: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export const Otp =
  mongoose.models.Otp || mongoose.model("Otp", otpSchema);
