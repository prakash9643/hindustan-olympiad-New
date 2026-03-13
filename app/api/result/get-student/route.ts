import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { cookies } from "next/headers";
import { verifyResultToken } from "@/utils/jwt";
import { Result } from "@/utils/models/result";

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
    // console.log("JWT studentId:", studentId, typeof studentId);

    const student = await Result.findOne({ studentId }).lean();

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Result fetch (IMPORTANT)
    const result = await Result.findOne({ studentId }).lean();
    // console.log("🎯 Any Result:", result);

    // console.log("🎯 Result Fetch:", { studentId, result });

    if (!result) {
      return NextResponse.json(
        { message: `Result Not Available 
          The student may have been Absent, Disqualified, or the Roll Number/OMR Code entered is incorrect. Please recheck and try again.`},
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
      result,
    });
  } catch (error) {
    console.error("❌ Fetch Student Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
