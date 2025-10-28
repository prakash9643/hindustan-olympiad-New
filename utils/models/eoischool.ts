import mongoose from "mongoose";

export interface IEoiSchool extends mongoose.Document {
  schoolName: string;
  schoolCoordinatorContact: string;
  schoolAddress: string;
  district: string;
}

const eoiSchoolSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    schoolCoordinatorContact: { type: String, required: true },
    schoolAddress: { type: String, required: true },
    district: { type: String, required: true },
  },
  { timestamps: true }
);
delete mongoose.models.EoiSchool;
export const EoiSchool =
  mongoose.models.EoiSchool || mongoose.model<IEoiSchool>("EoiSchool", eoiSchoolSchema);
