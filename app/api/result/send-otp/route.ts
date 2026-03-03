import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
// import { Student } from "@/utils/models/Student";
import { Otp } from "@/utils/models/Otp";
import { Result } from "@/utils/models/result";

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
    
    const student = await Result.findOne({ studentId });

    if (!student) {
      return NextResponse.json(
        { message: "Input correct 11 digit Hindustan Olympiad 2025 Roll number" },
        { status: 404 }
      );
    }

    
    const mobile = student.parentContact?.trim();

    // ❌ Case 1: Mobile not filled
    if (!mobile) {
        return NextResponse.json(
        { message: "Your provided mobile number is not valid. Please Click on click here button to fill your details." },
        { status: 400 }
        );
    }

    // ❌ Case 2: Not 10 digits
    const cleanNumber = mobile.replace(/\D/g, ""); // remove spaces, +91 etc.

    if (cleanNumber.length !== 10) {
        return NextResponse.json(
        { message: "You have not filled mobile number. Please Click on click here button to fill your details." },
        { status: 400 }
        );
    }

    // 🔐 Generate OTP
    let otp;

    if (process.env.TEST_MODE === "true") {
      otp = "123456"; // fixed test otp
    } else {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTP
    await Otp.deleteMany({ studentId });

    // Save OTP
    await Otp.create({
      studentId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 📲 Call Parent SMS API
    const smsRes = await fetch(`${process.env.NEXT_PUBLIC_TESTING_URL}/api/result/send-sms-parent`, {
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

    const masked = cleanNumber.replace(/\d(?=\d{4})/g, "*");
    return NextResponse.json({
      success: true,
      message: "OTP sent to registered mobile number",
      mobile: masked,
      otp: otp,
    });
  } catch (error) {
    console.error("❌ OTP Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
