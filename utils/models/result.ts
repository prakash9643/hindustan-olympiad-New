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
    PHYSICS: { type: String, default: 0 },
    HISTORY: { type: String, default: 0 },
    ACCOUNTS: { type: String, default: 0 },
    BIOLOGY: { type: String, default: 0 },
    ECONOMICS: { type: String, default: 0 },
    GENERALKNOWLEDGE: { type: String, default: 0 },
    ENGLISH: { type: String, default: 0 },
    LOGICALREASONING: { type: String, default: 0 },
    SCIENCE: { type: String, default: 0 },
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
