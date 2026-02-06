import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { Otp } from "@/utils/models/Otp";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { message: "Roll number is required" },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ studentId });

    if (!student) {
      return NextResponse.json(
        { message: "Invalid Roll Number" },
        { status: 404 }
      );
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTP
    await Otp.deleteMany({ studentId });

    // Save OTP
    await Otp.create({
      studentId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 📲 Call Parent SMS API
    const smsRes = await fetch(`http://localhost:3000/api/result/send-sms-parent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: student.parentContact,
          otp: otp,
        }),
      }
    );
    const smsData = await smsRes.json();
    console.log("📩 SMS RESPONSE:", smsData, otp);

    if (!smsRes.ok) {
      throw new Error("SMS sending failed");
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to registered mobile number",
    });
  } catch (error) {
    console.error("❌ OTP Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
