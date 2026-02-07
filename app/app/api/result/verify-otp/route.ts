import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Otp } from "@/utils/models/Otp";
import { generateResultToken } from "@/utils/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { studentId, otp } = await req.json();

    if (!studentId || !otp) {
      return NextResponse.json(
        { message: "Roll number and OTP are required" },
        { status: 400 }
      );
    }

    const record = await Otp.findOne({ studentId, otp });

    if (!record) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    // OTP used
    await Otp.deleteOne({ _id: record._id });

    // 🔐 Generate Token
    const token = generateResultToken(studentId);

    // 🍪 HttpOnly Cookie
    const res = NextResponse.json({
      success: true,
      message: "OTP verified",
      studentId,
    });

    res.cookies.set("result_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("❌ OTP Verify Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
