import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Otp } from "@/utils/models/Otp";
import { Result } from "@/utils/models/result";
import { generateResultToken } from "@/utils/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { value, type, otp } = await req.json();

    if (!value || !otp || !type) {
      return NextResponse.json(
        { message: "OTP verification failed. Missing required fields." },
        { status: 400 }
      );
    }

    let student;

    // 🔎 Find student
    if (type === "roll") {
      student = await Result.findOne({ studentId: value });
    } 
    else if (type === "omr") {
      student = await Result.findOne({ omrCode: value });
    } 
    else {
      return NextResponse.json(
        { message: "Invalid request type" },
        { status: 400 }
      );
    }

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // 🔎 Find OTP record
    const record = await Otp.findOne({
      studentId: student.studentId,
      omrCode: student.omrCode,
      otp: String(otp),
    });

    if (!record) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ⏳ Expiry check
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });

      return NextResponse.json(
        { message: "OTP expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // 🗑️ Delete OTP after use
    await Otp.deleteOne({ _id: record._id });

    // 🔐 Generate JWT token
    const token = generateResultToken(student.studentId, student.omrCode);

    // 🍪 Set Cookie
    const res = NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      studentId: student.studentId,
      omrCode: student.omrCode,
    });

    res.cookies.set("result_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
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