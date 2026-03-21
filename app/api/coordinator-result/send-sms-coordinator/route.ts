import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";

export async function POST(req: NextRequest) {
  try {
    // const body = await req.json();
    // console.log("📥 SMS API BODY:", body);
    const { coordinatorPhone, Coorotp } = await req.json();

    if (!coordinatorPhone || !Coorotp) {
      return NextResponse.json(
        { success: false, error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MESEJI_API_KEY || "G6ZybV4unwe4s3FNM3a8";
    if (!apiKey) {
        console.error("❌ MESEJI_API_KEY is missing. Did you set it in .env / server env?");
        return NextResponse.json(
        { success: false, error: "Server SMS API key missing" },
        { status: 500 }
        );
    }
    
    const data = qs.stringify({
      sender: "HNOLYM",
            content: `Your OTP to view Hindustan Olympiad 2025 Result is ${Coorotp}.
      Warm Regards, 
      Team Hindustan
      `,
            apikey: apiKey,
            type: "normal",
            pe_id: "1601100000000000354",
            template_id: "1107176959284918351", // 👈 parent SMS ka DLT template_id
            to: coordinatorPhone,
            tm_id: "1702158080740553305",       // 👈 parent SMS ka DLT tm_id
    });

    await axios.post("https://api.meseji.one/sendSMS", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Parent SMS Error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, error: "SMS failed" },
      { status: 500 }
    );
  }
}
