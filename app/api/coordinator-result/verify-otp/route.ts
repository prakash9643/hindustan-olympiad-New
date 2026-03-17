import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Coordinatorotp } from "@/utils/models/coordinatorOtp";

export async function POST(req: Request) {
  await connectDB();

  const { schoolId, otp } = await req.json();

  const record = await Coordinatorotp.findOne({ schoolId, otp });

  if (!record) {
    return NextResponse.json({ success: false, message: "Invalid OTP" });
  }

  if (record.expiresAt < Date.now()) {
    return NextResponse.json({ success: false, message: "OTP expired" });
  }

  return NextResponse.json({ success: true });
}