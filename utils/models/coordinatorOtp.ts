import { Omega } from "lucide-react";
import mongoose from "mongoose";

const CoordinatorotpSchema = new mongoose.Schema({
  otp: { type: String, required: true },
  schoolId: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export const Coordinatorotp =
  mongoose.models.Coordinatorotp || mongoose.model("Coordinatorotp", CoordinatorotpSchema);
