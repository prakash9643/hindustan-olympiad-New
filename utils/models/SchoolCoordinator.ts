import mongoose from "mongoose";

const schoolCoordinatorSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, unique: true, required: true },
    email: String,
    schoolId: String,
    school_id: String,
    OTP: String,
    lastOTPSent: Date,
  },
  { timestamps: true }
);

export const SchoolCoordinator =
  mongoose.models.SchoolCoordinator ||
  mongoose.model("SchoolCoordinator", schoolCoordinatorSchema);