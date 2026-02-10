import { NextRequest } from "next/server";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { Student } from "@/utils/models/Student";
import { TeamMember } from "@/utils/models/team-members";
import { pipeline, Readable } from "stream";
import { PassThrough } from "stream";
import { format } from "fast-csv";
import { connectDB } from "@/utils/config/dbConfig";
import { regions, districts } from "@/utils/constants";

connectDB().catch(console.error);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const headers = req.headers;
  const authorization = headers.get("authorization");

  if (!authorization) {
    return new Response(JSON.stringify({ error: "Authorization header required" }), {
      status: 400,
    });
  }

  const token = authorization.split(" ")[0];
  if (!token || token.length !== 24) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const schoolCoordinator = await SchoolCoordinator.findById(token);
  const teamMember = await TeamMember.findById(token);

  if (!schoolCoordinator && !teamMember) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const isTeamMember = !!teamMember;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type"); // new parameter

  const query: any = {};

  // 🔍 Existing search logic
  if (search) {
    const searchRegex = new RegExp(search, "i");
    const orQuery: any[] = [{ name: searchRegex }];
    const rollNumber = Number(search);
    if (!isNaN(rollNumber)) orQuery.push({ studentId: rollNumber });
    query.$or = orQuery;
  }

  // --------------------------------------------
  // ⭐ NEW EXPORT TYPES ⭐
  // --------------------------------------------

  // const cutoff = new Date("2025-07-12T10:50:00.000Z");

  // // Export all students till 17 Nov 2025
  // if (type === "before") {
  //   query.createdAt = { $lte: cutoff };
  // }
  // const startDate = new Date("2025-12-07T10:30:00.000Z");
  // const endDate = new Date("2025-12-08T23:59:59.999Z");

  // Export students between 7 July and 8 July 2025
  // if (type === "before") {
  //   query.createdAt = {
  //     $gte: startDate,
  //     $lte: endDate,
  //   };
  // }

  // Export students added by your ID after 18 Nov 2025
  // if (type === "after") {
  //   query.createdAt = { $gte: new Date("2025-11-18T00:00:00.000Z") };
  //   query.addedBy = { $ne: "6874f0592c97dbf80815617c" };    // YOUR ID FIXED
  // }

  // Existing Filters
  if (isTeamMember) {
    query.region = { $in: teamMember.region.split(",") };
  }

  if (schoolCoordinator) {
    query.schoolId = schoolCoordinator.school_id;
  }

  // Cursor fetch
  const cursor = Student.find(query).cursor();

  const csvStream = format({ headers: true });
  const passthrough = new PassThrough();

  function getRegionLabel(regionValue: string): string {
    const region = regions.find(r => r.value === regionValue);
    return region ? region.label : regionValue;
  }

  function getDistrictLabel(regionValue: string, districtValue: string): string {
    const regionDistricts = districts[regionValue as keyof typeof districts];
    if (!regionDistricts) return districtValue;
    const district = regionDistricts.find(d => d.value === String(districtValue).padStart(2, "0"));
    return district ? district.label : String(districtValue);
  }

  pipeline(csvStream, passthrough, (err) => {
    if (err) console.error("Pipeline failed", err);
  });

  (async () => {
    for await (const student of cursor) {
      csvStream.write({
        studentId: student.studentId,
        name: student.name,
        class: student.class,
        section: student.section,
        gender: student.gender,
        stream: student.stream,
        parentName: student.parentName,
        parentContact: student.parentContact,
        schoolName: student.schoolName,
        branch: student.branch,
        district: getDistrictLabel(student.region, student.district),
        region: getRegionLabel(student.region),
        city: student.city,
        paymentVerified: student.paymentVerified ? "Yes" : "No",
        schoolId: student.schoolId,
        pincode: student.pincode,
      });
    }
    csvStream.end();
  })();

  return new Response(Readable.toWeb(passthrough) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=students.csv`,
    },
  });
}
