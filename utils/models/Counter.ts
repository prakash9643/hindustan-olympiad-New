import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: String, // `${regionCode}_${districtCode}`
  seq: { type: Number, default: 0 },
});

export const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);
