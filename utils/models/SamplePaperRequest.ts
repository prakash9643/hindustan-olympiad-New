import mongoose, { Schema, models } from "mongoose";

export interface SamplePaperRequestSchemaS extends mongoose.Document{
  name: String;
  phone: String;
  class: String;
  stream?: String;
  region: String;
  district: String;
  otpVerified: Boolean;
  createdAt: Date;
}


const SamplePaperRequestSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    class: { type: String, required: true },
    stream: { type: String },
    region: { type: String, required: true },
    district: { type: String, required: true },
    otpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SamplePaperRequest =
  models.SamplePaperRequest ||
  mongoose.model("SamplePaperRequest", SamplePaperRequestSchema);
