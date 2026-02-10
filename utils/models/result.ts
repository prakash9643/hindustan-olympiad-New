import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },

    sectionA: { type: Number, default: 0 },
    sectionB: { type: Number, default: 0 },
    sectionC: { type: Number, default: 0 },
    sectionD: { type: Number, default: 0 },
    sectionE: { type: Number, default: 0 },

    fullmarks: { type: Number, default: 0 },

    nationalmarks: Number,
    regionmarks: Number,
    districtmarks: Number,
  },
  { timestamps: true, collection: "results" }
);

export const Result =
  mongoose.models.Result || mongoose.model("Result", ResultSchema);
