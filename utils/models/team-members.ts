import mongoose from "mongoose";
export interface ITeamMember extends Document {
  name: string;
  phone: string;
  email?: string;
  region?: string;
  district?: string;
  role: "finance" | "viewer" | "admin";
  OTP?: string;
  lastOTPSent?: Date;
}

const teamMemberSchema = new mongoose.Schema(
    {
        name: String,
        phone: { type: String, unique: true, required: true },
        email: String,
        region: String,
        district: String,
        OTP: String,
        lastOTPSent: Date,
        // ✅ Add this field
        role: {
        type: String,
        enum: ["finance" , "viewer", "admin"], // Optional: restrict to known roles
        default: "viewer",                    // Optional: default role
        },
    },
    { timestamps: true }
);

export const TeamMember =
    mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);