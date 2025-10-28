import mongoose from "mongoose";


const schoolSchema = new mongoose.Schema(
  {
    schoolId : {type:String, unique: true}, // custom schoolId field
    schoolName: String,
    branch: String,
    serialNumber: {type: String, required: false},
    district: [String],
    region: String,
    city: String,
    pincode: String,
    board: String,
    principalName: String,
    principalPhone: String,
    principalEmail: String,
    coordinatorName: String,
    coordinatorPhone: String,
    coordinatorEmail: String,
    studentsCount: { type: Number, default: 0 },
    paymentVerification: { type: Number, default: 0 },
    // School model me
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', required: true }

  },
  { timestamps: true }
);

export const School =
  mongoose.models.School || mongoose.model("School", schoolSchema);
