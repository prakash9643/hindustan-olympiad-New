import mongoose from "mongoose";

export interface IStudent extends mongoose.Document {
  studentId: string;
  name: string;
  class: string;
  section: string;
  gender: string;
  stream: string;
  parentName: string;
  parentContact: string;
  schoolId: string;
  schoolName: string;
  branch: string;
  city: string;
  district: [string];
  region: string;
  pincode: string;
  paymentVerified: boolean;
  paymentVerifiedBy: string;
  addedBy: mongoose.Types.ObjectId;  // 👈 reference to TeamMember who added the student
}


const studentSchema = new mongoose.Schema(
  {
    studentId: String,
    name: String,
    class: String,
    section: String,
    gender: String,
    stream: String,
    parentName: String,
    parentContact: String,
    schoolId: String,
    schoolName: String,
    branch: String,
    city: String,
    district: [String],
    region: String,
    pincode: String,
    paymentVerified: { type: Boolean, default: false },
    paymentVerifiedBy: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', required: true }
  },
  { timestamps: true }
);

export const Student =
  mongoose.models.Student || mongoose.model <IStudent>("Student", studentSchema);
