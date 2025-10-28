import { NextRequest, NextResponse } from "next/server";
import mongoose, { Document } from "mongoose";
import { ActivityLog } from "@/utils/models/ActivityLogs";
import { TeamMember } from "@/utils/models/team-members";

interface ITeamMember extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  phone: string;
  email?: string;
  region?: string;
  OTP?: string;
  lastOTPSent?: Date;
  role: "finance" | "viewer" | "admin";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // logged-in user ID
  const schoolId = searchParams.get("schoolId");
  const studentId = searchParams.get("studentId");

  console.log("🔍 Query Params =>", { id, schoolId, studentId });

  if (!id) {
    return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
  }

  try {
    const teamMember: ITeamMember | null = await TeamMember.findById(id).lean();

    if (!teamMember) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let activityLogs;

    if (teamMember.role === "finance") {
    if (studentId) {
        // Agar studentId diya hai to uske logs
        activityLogs = await ActivityLog.find({ studentId: String(studentId) })
        .sort({ createdAt: -1 })
        .lean();
    } else if (schoolId) {
        // Agar schoolId diya hai lekin studentId null hai
        activityLogs = await ActivityLog.find({ schoolId: String(schoolId) })
        .sort({ createdAt: -1 })
        .lean();
    } else {
        // Fallback - sabhi logs
        activityLogs = await ActivityLog.find({})
        .sort({ createdAt: -1 })
        .lean();
    }
    }


    return NextResponse.json(activityLogs);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch activity logs",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
