import { connectDB } from "@/utils/config/dbConfig";
import { NextResponse } from "next/server";
import { SamplePaperRequest } from "@/utils/models/SamplePaperRequest";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, phone, class: studentClass, stream, region, district, otpVerified } = body;

    if (!name || !phone || !studentClass || !region || !district) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to DB
    const newRequest = await SamplePaperRequest.create({
      name,
      phone,
      class: studentClass,
      stream,
      region,
      district,
      otpVerified: otpVerified || false,
    });

    return NextResponse.json({
      success: true,
      message: "Request saved successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error saving sample paper request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
