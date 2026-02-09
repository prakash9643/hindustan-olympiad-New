// app/api/send-sms-coordinator/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      console.log("❌ phoneNumber missing");
      return NextResponse.json({ success: false, error: "phoneNumber is required" }, { status: 400 });
    }

    const apiKey = 'G6ZybV4unwe4s3FNM3a8';
    if (!apiKey) {
      console.error("❌ MESEJI_API_KEY is missing. Did you set it in .env / server env?");
      return NextResponse.json(
        { success: false, error: "Server SMS API key missing" },
        { status: 500 }
      );
    }

    const data = qs.stringify({
      sender: "HNOLYM",
      content: `Your number has been successfully registered on Hindustan Olympiad Website.`,
      apikey: apiKey,
      type: "normal",
      pe_id: "1601100000000000354",
      template_id: "1107175283020045745",
      to: phoneNumber,
      tm_id: "1702158080740553305",
    });

    console.log("📩 Sending SMS to:", phoneNumber);

    const response = await axios.post("https://api.meseji.one/sendSMS", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("✅ Meseji response:", response.data);

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    const details = error.response?.data || error.message;
    console.error("❌ SMS Error:", details);
    return NextResponse.json(
      { success: false, error: "SMS failed", details },
      { status: 500 }
    );
  }
}
