import { NextRequest } from "next/server";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { School } from "@/utils/models/School";
import { TeamMember } from "@/utils/models/team-members";
import { pipeline, Readable } from "stream";
import { PassThrough } from "stream";
import { format } from "fast-csv";
import { connectDB } from "@/utils/config/dbConfig";
import { districts, regions } from "@/utils/constants";

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
        const orQuery: any[] = [{ schoolName: searchRegex }];
        query.$or = orQuery;
    }

    if (isTeamMember) {
        query.region = { $in: teamMember.region.split(",") };
    }
    if (schoolCoordinator) {
        return new Response(JSON.stringify({ error: "School cant download schools list" }), { status: 401 });
    }

    const cursor = School.find(query).cursor();

    const csvStream = format({ headers: true });
    const passthrough = new PassThrough();

    // Push CSV data to PassThrough stream
    pipeline(csvStream, passthrough, (err) => {
        if (err) console.error("Pipeline failed", err);
    });

    // Write each student record to CSV stream
    (async () => {
        for await (const school of cursor) {
            csvStream.write({
                "School ID": school.schoolId,
                "School Name": school.schoolName,
                "Branch": school.branch,
                "Region": regions.find(region => region.value === school.region)?.label,
                "District": Array.isArray(school.district)
    ? school.district
        .map((dCode: string) => 
            districts[school.region as keyof typeof districts]
                ?.find(d => d.value === dCode)?.label
        )
        .filter(Boolean)
        .join(", ")
    : districts[school.region as keyof typeof districts]
        ?.find(d => d.value === school.district)?.label,

                "Pincode": school.pincode,
                "Board": school.board,
                "Principal Name": school.principalName,
                "Principal Phone": school.principalPhone,
                "Principal Email": school.principalEmail,
                "Coordinator Name": school.coordinatorName,
                "Coordinator Phone": school.coordinatorPhone,
                "Coordinator Email": school.coordinatorEmail,
                "Total Students": school.studentsCount,
                "Payment Verified": school.paymentVerification,
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