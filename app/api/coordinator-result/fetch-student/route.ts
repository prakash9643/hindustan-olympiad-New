import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { Result } from "@/utils/models/result";

export async function POST(req: Request) {
  await connectDB();

  const { schoolId } = await req.json();

  // 1. Get students of that school
  const students = await Student.find({ schoolId });

  if (!students.length) {
    return NextResponse.json({
      success: false,
      message: "No Record Found",
    });
  }

  // 2. Get all studentIds
  const studentIds = students.map((s) => s.studentId);

  // 3. Fetch results
  const results = await Result.find({
    studentId: { $in: studentIds },
  });

  // 4. Merge data
  const finalData = students.map((s) => {
    const result = results.find(
      (r) => r.studentId === s.studentId
    );

    return {
      _id: s._id,
      rollNo: s.studentId,
      name: s.name,
      class: s.class,
      stream: s.stream,

      // result fields
      marks: result?.fullmark || 0,
      districtrank: result?.districtrank || "-",
      regionrank: result?.regionrank || "-",
      nationalrank: result?.nationalrank || "-",
    };
  });

  return NextResponse.json({
    success: true,
    students: finalData,
  });
}