import mongoose from "mongoose";

export interface EssaySchemaS extends mongoose.Document{
  name: String,
  gender: String,
  age: Number,
  school: String,
  class: String,
  phone: String,
  location: String,
  essayFile: String, // file path
  selfieFile: String, // file path
  agreed: Boolean,
}

const EssaySchema = new mongoose.Schema(
  {
    name: String,
    gender: String,
    age: Number,
    school: String,
    class: String,
    phone: String,
    location: String,
    essayFile: String, // file path
    selfieFile: String, // file path
    agreed: Boolean,
  },
  { timestamps: true }
);

export const Essay =
  mongoose.models.Essay || mongoose.model("Essay", EssaySchema);
