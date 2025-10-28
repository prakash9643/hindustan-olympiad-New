// app/api/send-sms-parent/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
console.log("📌 API file loaded");
export async function POST(req: NextRequest,) {
    try {
        const { phone } = await req.json();
        
        if (!phone) {
            return NextResponse.json(
                { success: false, error: "Phone Number and Class are required" },
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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // console.log("Generated OTP:", otp);

        const data = qs.stringify({
            sender: "HNOLYM",
            content: `Your OTP for accessing the sample paper is ${otp}. Please enter this code to continue. Team Hindustan (HT Media)`,
            apikey: apiKey,
            type: "normal",
            pe_id: "1601100000000000354",
            template_id: "1107176044135452759", // 👈 parent SMS ka DLT template_id
            to: phone,
            tm_id: "1702158080740553305",       // 👈 parent SMS ka DLT tm_id
    });
    
    console.log("📩 Sending Parent SMS to:", phone,);
    
    const response = await axios.post("https://api.meseji.one/sendSMS", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    console.log("📌 API route hit");
    console.log("✅ Parent SMS response:", response.data);

    return NextResponse.json({ success: true, data: response.data, otp });
  } catch (error: any) {
    const details = error.response?.data || error.message;
    console.error("❌ Parent SMS Error:", details);
    return NextResponse.json(
      { success: false, error: "Parent SMS failed", details },
      { status: 500 }
    );
  }
}
