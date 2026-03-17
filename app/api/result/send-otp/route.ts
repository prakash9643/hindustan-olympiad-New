import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Otp } from "@/utils/models/Otp";
import { Result } from "@/utils/models/result";

export async function POST(req: Request) {
  try {

    await connectDB();

    const { value, type } = await req.json();

    if (!value) {
      return NextResponse.json(
        { message: "Invalid Roll number/OMR code Kindly recheck and try again" },
        { status: 400 }
      );
    }

    let student;

    // 🔎 Find student based on selected type

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
        {
          description: `
            <b>Result Not Available</b><br/>
            The student may have been Absent, Disqualified, or the Roll Number/OMR Code entered is incorrect.<br/>
            Please recheck and try again.
          `
        },
        { status: 404 }
      );
    }

    const mobile = student.parentContact?.trim() || "";

    // Clean number
    const cleanNumber = mobile.replace(/\D/g, "");

    const hasMobile = cleanNumber.length === 10;

    // 🔐 Generate OTP

    let otp;

    // if (process.env.TEST_MODE === "true") {
    //   otp = "123456";
    // } else {
    // }
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Student Found:", student);
    console.log("Student OMR:", student.omrCode);

    // delete old otp
    await Otp.deleteMany({ studentId: student.studentId, omrCode: student.omrCode });

    // save new otp
    await Otp.create({
      studentId: student.studentId,
      omrCode: student.omrCode,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // 📲 Send SMS

    if (hasMobile) {

        const smsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/result/send-sms-parent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: cleanNumber,
              otp: otp,
            }),
          }
        );

        const smsData = await smsRes.json();
        console.log("📩 SMS RESPONSE:", smsData, otp);

        if (!smsRes.ok) {
          throw new Error("SMS sending failed");
        }

      }

    // const smsData = await smsRes.json();
    // console.log("📩 SMS RESPONSE:", smsData, otp);

    // if (!smsRes.ok) {
    //   throw new Error("SMS sending failed");
    // }

    // mask number

    const masked = cleanNumber.replace(/\d(?=\d{4})/g, "*");

    return NextResponse.json({
      success: true,
      message: hasMobile
        ? "OTP sent to registered mobile number"
        : "Mobile number not available. OTP generated for testing.",
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