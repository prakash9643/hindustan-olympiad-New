import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Result } from "@/utils/models/result";

export async function POST(req: Request) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { message: "Roll Number required" },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Result.findOne({ studentId });

    if (!result) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: {
        studentname: result.studentname,
        district: result.district,
        fullmark: result.fullmark
      }
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}