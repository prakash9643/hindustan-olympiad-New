import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { EoiStudent } from "@/utils/models/eoistudent";

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
        { class: { $regex: query, $options: "i" } },
      ];
    }

    if (region) filter.region = region;
    if (district) filter.district = district;

    const total = await EoiStudent.countDocuments(filter);
    const students = await EoiStudent.find(filter)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      region,
      district,
      phoneNumber,
      schoolName,
      schoolCoordinatorContact,
      class: studentClass,
    } = body;

    // Validate required fields
    if (
      !name ||
      !region ||
      !district ||
      !phoneNumber ||
      !schoolName ||
      !schoolCoordinatorContact ||
      !studentClass
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid student phone number" },
        { status: 400 }
      );
    }

    if (!phoneRegex.test(schoolCoordinatorContact)) {
      return NextResponse.json(
        { error: "Invalid school coordinator contact number" },
        { status: 400 }
      );
    }

    // Create a new student document
    const result = await EoiStudent.create({
      name,
      region,
      district,
      phoneNumber,
      schoolName,
      schoolCoordinatorContact,
      class: studentClass,
    });

    return NextResponse.json(
      {
        message: "Student registered successfully",
        student: result,
      },
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