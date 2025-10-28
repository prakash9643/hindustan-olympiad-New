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
// Required to bypass Next.js' default body handling for streamed responses
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

  const query: any = {};
  if (search) {
    const searchRegex = new RegExp(search, "i");
    const orQuery: any[] = [{ name: searchRegex }];
    const rollNumber = Number(search);
    if (!isNaN(rollNumber)) orQuery.push({ studentId: rollNumber });
    query.$or = orQuery;
  }

  if (isTeamMember) {
    query.region = { $in: teamMember.region.split(",") };
  }
  if (schoolCoordinator) {
    query.schoolId = schoolCoordinator.school_id;
  }

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

  // Push CSV data to PassThrough stream
  pipeline(csvStream, passthrough, (err) => {
    if (err) console.error("Pipeline failed", err);
  });

  // Write each student record to CSV stream
  (async () => {
    for await (const student of cursor) {
      csvStream.write({
        studentId: student.paymentVerified ? student.studentId : "XXXXX",
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
