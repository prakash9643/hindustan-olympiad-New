import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { School } from "@/utils/models/School";
import { Coordinatorotp } from "@/utils/models/coordinatorOtp";
import { Otp } from "@/utils/models/Otp";

export async function POST(req: Request) {
  await connectDB();

  const { schoolId } = await req.json();

  if (!schoolId) {
    return NextResponse.json({ success: false, message: "School ID required" });
  }

  // 1. Find school
  const school = await School.findOne({ schoolId });

  if (!school || !school.coordinatorPhone) {
    return NextResponse.json({
      success: false,
      message:
        "Either you have entered an incorrect school ID or there is no mobile number associated with this school ID. Kindly contact the Hindustan Representative.",
    });
  }
  // 2. Generate OTP
  const Coorotp = Math.floor(100000 + Math.random() * 900000);
  console.log(Coorotp, "OTP Not Recieved")
  await Coordinatorotp.deleteMany({ schoolId });
  // 3. Save OTP
  await Coordinatorotp.create({
    schoolId: schoolId,
    otp: Coorotp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
  });

  // 4. Send OTP (for now console)
  console.log("OTP:", Coorotp);

  return NextResponse.json({
    success: true,
    message: `OTP sent to ${school.coordinatorPhone}`,
    otp: Coorotp,
  });
}