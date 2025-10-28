import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { School } from "@/utils/models/School";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";

connectDB().catch(console.error);

export async function GET(req: NextRequest) {
  await connectDB();

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "true";

  const summary = {
    totalSchools: 0,
    created: 0,
    skipped: 0,
    alreadyExists: 0,
    errors: [] as any[],
  };

  // 👉 new: store detailed lists
  const details = {
    createdList: [] as any[],
    existingList: [] as any[],
    skippedList: [] as any[],
  };

  try {
    const schools = await School.find({}).lean();
    summary.totalSchools = schools.length;

    for (const school of schools) {
      try {
        if (!school.coordinatorName || !school.coordinatorPhone) {
          summary.skipped++;
          details.skippedList.push({
            schoolId: school.schoolId,
            schoolName: school.schoolName,
            reason: "Missing coordinator info",
          });
          continue;
        }

        const existing = await SchoolCoordinator.findOne({
          $or: [
            { schoolId: school._id },
            { school_id: school.schoolId },
          ],
        }).lean();

        if (existing && !Array.isArray(existing)) {
          summary.alreadyExists++;
          details.existingList.push({
            schoolId: school.schoolId,
            schoolName: school.schoolName,
            coordinatorName: existing.name || "N/A",
            coordinatorPhone: existing.phone || "N/A",
          });
          continue;
        }

        const payload = {
          name: school.coordinatorName,
          phone: school.coordinatorPhone,
          email: school.coordinatorEmail || "",
          schoolId: school._id,
          school_id: school.schoolId,
        };

        if (!dry) {
          await SchoolCoordinator.create(payload);
        }

        summary.created++;
        details.createdList.push({
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          coordinatorName: school.coordinatorName,
          coordinatorPhone: school.coordinatorPhone,
        });
      } catch (err: any) {
        summary.errors.push({
          schoolId: school._id,
          message: err.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({ dry, summary, details }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error in coordinator fix route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
