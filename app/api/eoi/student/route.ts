import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { IndiviualStudent } from "@/utils/models/indiviualStudents";
import { generateStudentId } from "@/utils/models/generateStudentId";

connectDB().catch(console.error);

// ========== GET All Students ==========
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";
    const region = searchParams.get("region") || "";
    const district = searchParams.get("district") || "";

    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { schoolName: { $regex: query, $options: "i" } },
        { parentName: { $regex: query, $options: "i" } },
      ];
    }

    // if (region) filter.region = region;
    if (district) filter.district = district;

    const total = await IndiviualStudent.countDocuments(filter);
    const students = await IndiviualStudent.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ========== POST (Register Student) ==========
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      name,
      district,
      schoolName,
      class: studentClass,
      section,
      gender,
      stream,
      parentName,
      parentContact,
      parentEmail,
      schoolBranch,
      schoolAddress,
      orderId,          // 👈 save
      transactionId,    // 👈 save
      dateOfBirth,     // 👈 save
      region,
      schoolDistrict,
      relationshipWithStudent
    } = body;

    if (
      !name ||
      !district ||
      !schoolName ||
      !studentClass ||
      !section ||
      !gender ||
      (["11", "12"].includes(studentClass) && !stream) ||
      !parentName ||
      !parentContact ||
      !parentEmail ||
      !schoolBranch ||
      !schoolAddress ||
      !orderId ||          // 👈 save
      !transactionId ||    // 👈 save
      !dateOfBirth ||
      !region ||
      !schoolDistrict ||
      !relationshipWithStudent
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(parentContact)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const studentId = await generateStudentId(body.district);

    const result = await IndiviualStudent.create({
      name,
      district,
      schoolName,
      class: studentClass,
      section,
      gender,
      stream: ["11", "12"].includes(studentClass) ? stream : "",
      parentName,
      parentContact,
      parentEmail,
      schoolBranch,
      schoolAddress,
      studentId,
      orderId,          // 👈 save
      transactionId,    // 👈 save
      paymentVerified: false, // default to false
      dateOfBirth,     // 👈 save
      region,
      schoolDistrict,
      relationshipWithStudent,
    });

    return NextResponse.json(
      { message: "Student registered successfully", student: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
