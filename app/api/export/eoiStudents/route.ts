import { NextRequest } from "next/server";
import { IndiviualStudent } from "@/utils/models/indiviualStudents";
// import { TeamMember } from "@/utils/models/team-members";
import { pipeline, Readable } from "stream";
import { PassThrough } from "stream";
import { format } from "fast-csv";
import { connectDB } from "@/utils/config/dbConfig";
import { trace } from "console";

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


  const search = searchParams.get("search") || "";

  const query: any = {};
  if (search) {
    const searchRegex = new RegExp(search, "i");
    const orQuery: any[] = [{ name: searchRegex }];
    const rollNumber = Number(search);
    if (!isNaN(rollNumber)) orQuery.push({ studentId: rollNumber });
    query.$or = orQuery;
  }

  const cursor = IndiviualStudent.find(query).cursor();

  const csvStream = format({ headers: true });
  const passthrough = new PassThrough();

  // Push CSV data to PassThrough stream
  pipeline(csvStream, passthrough, (err) => {
    if (err) console.error("Pipeline failed", err);
  });

  // Write each student record to CSV stream
  (async () => {
    for await (const SIndiviualStudent of cursor) {
      csvStream.write({
        studentId: SIndiviualStudent.studentId,
        name: SIndiviualStudent.name,
        class: SIndiviualStudent.class,
        section: SIndiviualStudent.section,
        gender: SIndiviualStudent.gender,
        stream: SIndiviualStudent.stream,
        yourName: SIndiviualStudent.relationshipWithStudent,
        parentContact: SIndiviualStudent.parentContact,
        schoolName: SIndiviualStudent.schoolName,
        SchoolBranch: SIndiviualStudent.SchoolBranch,
        City: SIndiviualStudent.district,
        Schoolregion: SIndiviualStudent.region,
        schoolAddress: SIndiviualStudent.schoolAddress,
        paymentVerified: SIndiviualStudent.paymentVerified,
        orderId: SIndiviualStudent.orderId,
        tractionId: SIndiviualStudent.transactionId,
        dateOfBirth: SIndiviualStudent.dateOfBirth ? SIndiviualStudent.dateOfBirth.toISOString().split('T')[0] : '',
        schoolDistrict: SIndiviualStudent.schoolDistrict,
        createdAt: SIndiviualStudent.createdAt ? SIndiviualStudent.createdAt.toISOString().split('T')[0] : '',
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
