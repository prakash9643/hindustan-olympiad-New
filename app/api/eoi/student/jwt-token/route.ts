import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { generateStudentId } from "@/utils/models/generateStudentId";
import { connectDB } from "@/utils/config/dbConfig";

connectDB().catch(console.error);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { district, name, parentContact } = body;

    if (!district || !name || !parentContact) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const studentId = await generateStudentId(district);

    console.log("this sus secrte",process.env.JWT_SECRET)

    const token = jwt.sign(
      { studentId, name, parentContact,service:"olympiad-backend"},
       process.env.JWT_SECRET || "super_strong_secret_key_123",
       { expiresIn: "30m" }
    );
    console.log("this sus secrte",process.env.JWT_SECRET)

    return NextResponse.json({ studentId, token });
  } catch (err) {
    console.error("Init student error:", err);
    return NextResponse.json(
      { error: "Failed to init student" },
      { status: 500 }
    );
  }
}