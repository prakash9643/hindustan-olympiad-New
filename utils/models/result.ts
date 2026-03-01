import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    studentname: { type: String, required: true, index: true },
    class: { type: String, required: true, index: true },
    section: { type: String, required: true, index: true },
    stream: { type: String, required: true, index: true },
    schoolname: { type: String, required: true, index: true },
    branch: { type: String, required: true, index: true },
    schoolId: { type: String, required: true, index: true },
    region: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    parentContact: { type: String, required: true, index: true },
    SUBJECT1: { type: String, default: 0 },
    SUBJECT2: { type: String, default: 0 },
    SUBJECT3: { type: String, default: 0 },
    SUBJECT4: { type: String, default: 0 },
    SUBJECT5: { type: String, default: 0 },
    subject1: { type: String, default: 0 },
    subject2: { type: String, default: 0 },
    subject3: { type: String, default: 0 },
    subject4: { type: String, default: 0 },
    subject5: { type: String, default: 0 },
    MATHEMATICS: { type: String, default: 0 },
    fullmark: { type: String, default: 0 },
    nationalrank: String,
    regionrank: String,
    districtrank: String,
  },
  { timestamps: true, collection: "results" }
);

export const Result =
  mongoose.models.Result || mongoose.model("Result", ResultSchema);
