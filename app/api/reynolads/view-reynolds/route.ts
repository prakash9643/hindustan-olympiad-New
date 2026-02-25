import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Essay } from "@/utils/models/Reynolds";

connectDB().catch(console.error);

// ========== GET All Students ==========
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || "";

    const filter: any = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { school: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ];
    }

    const total = await Essay.countDocuments(filter);
    const students = await Essay.find(filter)
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