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

  const mobile = String(school.coordinatorPhone || "").trim();

    // Clean number
    // const cleanNumber = mobile.replace(/\D/g, "");
    const cleanNumber = (mobile || "").toString().replace(/\D/g, "");

    const hasMobile = cleanNumber.length === 10;

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

  if (hasMobile && process.env.NEXT_PUBLIC_BASE_URL) {
    try {
        const smsRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinator-result/send-sms-coordinator`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                phone: cleanNumber,
                otp: Coorotp,
            }),
            }
        );
    
        const smsData = await smsRes.json();
        console.log("📩 SMS RESPONSE:", smsData);
        console.log("BASE URL:", process.env.NEXT_PUBLIC_BASE_URL);
    
        } catch (err) {
        console.error("SMS Error:", err);
    }
  }


  // 4. Send OTP (for now console)
  console.log("OTP:", Coorotp);

  return NextResponse.json({
    success: true,
    message: hasMobile
        ? "OTP sent to registered mobile number"
        : "Mobile number not available. OTP generated for testing.",
    otp: Coorotp,
    mobile: cleanNumber.slice(-4), // 👈 only last 4 digits
  });
}