import { connectDB } from "@/utils/config/dbConfig";
import { NextResponse } from "next/server";
import { MockTestRequest } from "@/utils/models/mocktestrequest";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { Studentname, phone, email, class: studentClass, stream, schoolName, region, district, otpVerified } = body;

    if (!Studentname || !phone || !email || !studentClass || !schoolName || !region || !district) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to DB
    const newRequest = await MockTestRequest.create({
      Studentname,
      phone,
      email,
      class: studentClass,
      stream,
      schoolName,
      region,
      district,
      otpVerified: otpVerified || false,
    });
    console.log("New Mock Test Request saved:", newRequest);
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
