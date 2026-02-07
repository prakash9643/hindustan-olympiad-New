import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { cookies } from "next/headers";
import { verifyResultToken } from "@/utils/jwt";

export async function POST() {
  try {
    await connectDB();

    // 🔐 1. Read token from cookie
    const token = cookies().get("result_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 2. Verify token
    let payload: any;
    try {
      payload = verifyResultToken(token);
    } catch {
      return NextResponse.json(
        { message: "Session expired go back to Result page again and Login to see your Result" },
        { status: 401 }
      );
    }

    // 🔥 3. FINAL studentId (ONLY from JWT)
    const studentId = payload.studentId;

    const student = await Student.findOne({ studentId }).lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("❌ Fetch Student Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
