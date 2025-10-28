import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { School } from "@/utils/models/School";
import { Counter } from "@/utils/models/Counter";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { TeamMember } from "@/utils/models/team-members";
// server side import only
import { districts as DISTRICTS_CONST } from "@/utils/constants";
import { ActivityLog } from "@/utils/models/ActivityLogs";

connectDB().catch(console.error);

const json = (data: any, status = 200) => NextResponse.json(data, { status });

/** ---------- helpers ---------- */
function getDistrictCode(region: string, districtRaw: string): string {
  const raw = (districtRaw || "").trim();
  const regionKey = (region || "").trim();

  // already numeric => return as 2-digit
  if (/^\d+$/.test(raw)) return raw.padStart(2, "0");

  // try to find in region list by label
  const list = (DISTRICTS_CONST as any)[regionKey] || [];
  let match = list.find(
    (d: any) => (d.label || "").toLowerCase() === raw.toLowerCase()
  );
  if (match) return String(match.value).padStart(2, "0");

  // try global search if not found in given region
  for (const rk of Object.keys(DISTRICTS_CONST)) {
    const arr = (DISTRICTS_CONST as any)[rk];
    const m = arr.find(
      (d: any) => (d.label || "").toLowerCase() === raw.toLowerCase()
    );
    if (m) return String(m.value).padStart(2, "0");
  }

  // Fallback - will fail later if still not numeric
  return raw;
}

/**
 * Final **numeric** SchoolId format (length = 7):
 *   R + DD + SSSS
 *   - R     : 1-digit region code (string `region` ka first char / numeric value)
 *   - DD    : 2-digit district numeric code
 *   - SSSS  : 4-digit running serial per (region+district)
 */
async function generateSchoolId(region: string, districtNumericCode: string) {
  const regionDigit = (region || "").trim()[0] || "0";
  const districtCode = (districtNumericCode || "").trim().padStart(2, "0");
  const counterId = `${regionDigit}_${districtCode}`;

  // 🧩 Step 1: Find latest school for same region + district
  const latestSchool = await School.findOne({
    schoolId: new RegExp(`^${regionDigit}${districtCode}`),
  })
    .sort({ schoolId: -1 })
    .lean() as { schoolId: string } | null; // Explicitly type the result

  let latestSerial = 0;
  if (latestSchool?.schoolId) {
    const lastPart = latestSchool.schoolId.slice(3);
    latestSerial = parseInt(lastPart, 10) || 0;
  }

  // 🧩 Step 2: Atomically update counter (ensures no duplicates)
  const updatedCounter = await Counter.findOneAndUpdate(
    { _id: counterId },
    [
      {
        $set: {
          seq: { $add: [{ $max: ["$seq", latestSerial] }, 1] },
        },
      },
    ],
    { new: true, upsert: true }
  );

  if (!updatedCounter) {
    throw new Error("Failed to update counter for school ID generation");
  }

  // 🧩 Step 3: Generate School ID
  const serial = updatedCounter.seq.toString().padStart(4, "0");
  return `${regionDigit}${districtCode}${serial}`;
}


async function getAuthEntities(token: string) {
  if (!token) return { teamMember: null, schoolCoordinator: null };
  const teamMember = await TeamMember.findById(token);
  const schoolCoordinator = await SchoolCoordinator.findById(token);
  return { teamMember, schoolCoordinator };
}

/* ========================= GET ========================= */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const debug = searchParams.get("debug") === "true";
    const query = searchParams.get("query") || "";
    const sortBy = searchParams.get("sortBy") || "schoolName";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const regionParam = searchParams.get("region") || "";
    const districtParam = searchParams.get("district") || "";
    const boardParam = searchParams.get("board") || "";

    const token = req.headers.get("authorization") || "";
    if (!token) return json({ error: "Authorization header required" }, 401);

    const { teamMember, schoolCoordinator } = await getAuthEntities(token);
    if (!teamMember && !schoolCoordinator) return json({ error: "Unauthorized" }, 401);

    const filter: any = {};
    const orFilters: any[] = [];


    // Search
    if (query) {
      const regex = new RegExp(query, "i");
      orFilters.push({ schoolName: regex }, { branch: regex }, { principalName: regex });
      if (/^[A-Za-z0-9_-]+$/.test(query)) {
        orFilters.push({ schoolId: query });
      }
      if (orFilters.length) filter.$or = orFilters;
    }

    // explicit filters
    if (regionParam) filter.region = regionParam;
    // if (districtParam) filter.district = districtParam;
    if (districtParam) {
      const DISTRICTS_CONST = districtParam.split(",");
      if (DISTRICTS_CONST.length > 0) {
        filter.district = { $in: DISTRICTS_CONST };
      }
    }
    if (boardParam) filter.board = boardParam;

    // team-member region guard
    let teamRegions: string[] = [];
    let appliedRegionGuard = false;
    const role = teamMember?.role || schoolCoordinator?.role;
    if (teamMember?.role === "viewer"){
      filter.addedBy = teamMember._id.toString();
    }
    if (teamMember && role === "team-member") {
      teamRegions = (teamMember.region || "")
        .split(",")
        .map((r: string) => r.trim())
        .filter(Boolean);
      if (teamMember.region !== "all" && teamRegions.length > 0) {
        appliedRegionGuard = true;
        filter.$and = (filter.$and || []).concat([
          {
            $or: [
              { region: { $in: teamRegions } },
              { region: { $regex: new RegExp(`\\b(${teamRegions.join("|")})\\b`, "i") } },
            ],
          },
        ]);
      }
    }

    const sort: any = {};
    sort[sortBy] = 1;

    if (all) {
      const schools = await School.find(filter).sort(sort).lean();
      return json({
        schools,
        ...(debug
          ? {
              debug: {
                token,
                role,
                teamMember: teamMember
                  ? { _id: teamMember._id.toString(), role: teamMember.role, region: teamMember.region }
                  : null,
                filter,
                appliedRegionGuard,
                teamRegions,
                count: schools.length,
              },
            }
          : {}),
      });
    }

    const skip = (page - 1) * limit;
    const [schools, total] = await Promise.all([
      School.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      School.countDocuments(filter),
    ]);

    return json({
      schools,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      ...(debug
        ? {
            debug: {
              token,
              role,
              teamMember: teamMember
                ? { _id: teamMember._id.toString(), role: teamMember.role, region: teamMember.region }
                : null,
              filter,
              appliedRegionGuard,
              teamRegions,
              returned: schools.length,
            },
          }
        : {}),
    });
  } catch (err: any) {
    console.error("GET /api/schools error:", err);
    return json({ error: "Server error", details: err?.message }, 500);
  }
}

/* ========================= POST ========================= */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = raw.newSchool ? raw.newSchool : raw;

    const token = req.headers.get("authorization") || "";
    if (!token) return json({ error: "Authorization header required" }, 401);

    const { teamMember, schoolCoordinator } = await getAuthEntities(token);
    if (!teamMember && !schoolCoordinator) return json({ error: "Unauthorized" }, 401);

    if (schoolCoordinator) {
      return json({ error: "Unauthorized: School coordinators can't add schools" }, 401);
    }

    console.log("POST /api/schools -> incoming:", data);

    if (!data.region || !data.district ) {
      return json({ error: "Region and district are required" }, 400);
    }

    // map/normalize district to numeric code
    const mappedDistrict = getDistrictCode(String(data.region), String(data.district));
    if (!/^\d+$/.test(mappedDistrict)) {
      return json(
        {
          error:
            "district must be a numeric string like '01', '12' (send the code or a valid label from constants).",
          got: data.district,
        },
        400
      );
    }
    data.district = mappedDistrict;

    if (teamMember && teamMember.role === "team-member") {
      const teamRegions = (teamMember.region || "").split(",").map((r: string) => r.trim());
      if (teamMember.region !== "all" && !teamRegions.includes(data.region)) {
        return json({ error: "Unauthorized: Region mismatch" }, 401);
      }
    }

    // 👉 NEW: region(1) + district(2) + serial(4)
    data.schoolId = await generateSchoolId(String(data.region), String(data.district));
    console.log("Generated schoolId:", data.schoolId);
    data.addedBy = teamMember?._id.toString();
    const school = new School(data);
    await school.save();

    let createdCoordinator = null;
    if (school._id) {
      createdCoordinator = await SchoolCoordinator.create({
        name: data.coordinatorName,
        phone: data.coordinatorPhone,
        email: data.coordinatorEmail,
        schoolId: school._id,
        school_id: school.schoolId,
      });
    }


    // // Log the activity for adding a new school
    await ActivityLog.create({
      schoolId: school.schoolId,
      userId: teamMember?._id.toString(),
      action: "SCHOOL_ADD",
      description: `New school ${school.schoolId} added with name ${school.schoolName} by ${teamMember?.name}`,
    });
    
    return json(
      {
        success: true,
        message: "School and coordinator saved successfully",
        school,
        coordinator: createdCoordinator,
      },
      201
    );
  } catch (err: any) {
    console.error("POST /api/schools error:", err);
    return json({ success: false, error: "Internal Server Error", details: err?.message }, 500);
  }
}
