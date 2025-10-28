import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { School } from "@/utils/models/School";
import { TeamMember } from "@/utils/models/team-members";
import { Counter } from "@/utils/models/Counter";
import { regions as REGIONS_CONST, districts as DISTRICTS_CONST } from "@/utils/constants";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";

connectDB().catch(console.error);

/* ---------------------- helpers ---------------------- */

// Map: regionLabel(lowercase) -> regionValue (e.g. "bihar" -> "3")
const REGION_LABEL_TO_VALUE: Record<string, string> = REGIONS_CONST.reduce(
  (acc: Record<string, string>, r) => {
    acc[(r.label || "").toLowerCase()] = r.value;
    return acc;
  },
  {}
);

function getRegionValue(regionRaw: string): string {
  const raw = (regionRaw || "").trim();
  if (!raw) return "";
  if (REGIONS_CONST.some((r) => r.value === raw)) return raw; // already numeric
  const mapped = REGION_LABEL_TO_VALUE[raw.toLowerCase()];
  return mapped || raw; // fallback (will be validated later)
}

function getDistrictCode(regionValue: string, districtRaw: string): string {
  const raw = String(districtRaw || "").trim(); // Ensure it's a string
  if (!raw) return "";

  if (/^\d+$/.test(raw)) return raw.padStart(2, "0");

  const list = (DISTRICTS_CONST as any)[regionValue] || [];
  let match = list.find(
    (d: any) => (d.label || "").toLowerCase() === raw.toLowerCase()
  );
  if (match) return String(match.value).padStart(2, "0");

  for (const rk of Object.keys(DISTRICTS_CONST)) {
    const arr = (DISTRICTS_CONST as any)[rk];
    const m = arr.find(
      (d: any) => (d.label || "").toLowerCase() === raw.toLowerCase()
    );
    if (m) return String(m.value).padStart(2, "0");
  }

  return raw;
}

/**
 * New SchoolId format: R + DD + SSSS (7 digits)
 *  R = region code (1 digit)
 *  DD = district code (2 digits)
 *  SSSS = 4 digit running serial
 */
async function generateSchoolId(region: string, districtNumericCode: string) {
  const regionDigit = (region || "").trim()[0] || "0";
  const districtCode = (districtNumericCode || "").trim().padStart(2, "0");

  const counterId = `${regionDigit}_${districtCode}`;
  let counter = await Counter.findById(counterId);
  if (!counter) counter = new Counter({ _id: counterId, seq: 0 });

  counter.seq += 1;
  await counter.save();

  const serial = counter.seq.toString().padStart(4, "0");
  return `${regionDigit}${districtCode}${serial}`; // e.g. 1030007
}

function validateSchoolPayload(s: any) {
  const required = [
    "schoolName",
    "branch",
    "board",
    "region",
    "district",
    "principalName",
    "principalPhone",
    "coordinatorName",
    "coordinatorPhone",
  ];

  const missing = required.filter((k) => !String(s?.[k] ?? "").trim());
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(String(s.principalPhone))) {
    return "Invalid principalPhone (must be 10 digits)";
  }
  if (!phoneRegex.test(String(s.coordinatorPhone))) {
    return "Invalid coordinatorPhone (must be 10 digits)";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (s.principalEmail && !emailRegex.test(String(s.principalEmail))) {
    return "Invalid principalEmail";
  }
  if (s.coordinatorEmail && !emailRegex.test(String(s.coordinatorEmail))) {
    return "Invalid coordinatorEmail";
  }

  if (!/^\d+$/.test(String(s.district))) {
    return `Invalid district: "${s.district}" (must map to numeric code like '01', '12')`;
  }

  return null;
}

/** Key to detect duplicates: same schoolName + branch + region + district */
function makeDeDupeKey(s: any) {
  // FIXED: Ensure all values are strings before calling string methods
  const schoolName = String(s.schoolName || "").trim().toLowerCase();
  const branch = String(s.branch || "").trim().toLowerCase();
  const region = String(s.region || "").trim();
  const district = String(s.district || "").trim(); // FIX: Ensure district is string
  
  return [schoolName, branch, region, district].join("|");
}

/* ---------------------- route ---------------------- */
export async function POST(req: NextRequest) {
  const failures: Array<{ index: number; error: string; payload: any }> = [];
  const successes: Array<{ index: number; _id: string; schoolId: string; schoolName: string }> = [];

  try {
    const { schools } = await req.json();
    const userId = req.headers.get("authorization");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const user = await TeamMember.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }

    if (!Array.isArray(schools) || schools.length === 0) {
      return NextResponse.json({ error: "schools array is required" }, { status: 400 });
    }

    const teamRegions: string[] = (user.region || "")
      .split(",")
      .map((r: string) => r.trim())
      .filter(Boolean);

    // ---------- 1) Normalize + validate + IN-FILE de-duplicate ----------
    const seen = new Set<string>();
    const toInsert: Array<{ rawIdx: number; payload: any; key: string }> = [];

    for (let i = 0; i < schools.length; i++) {
      const raw = schools[i];
      try {
        // FIXED: Ensure raw values are strings before processing
        const regionValue = getRegionValue(String(raw.region || ""));
        const districtCode = getDistrictCode(regionValue, String(raw.district || ""));

        const payload = {
          ...raw,
          region: regionValue,
          district: districtCode,
        };

        const validationError = validateSchoolPayload(payload);
        if (validationError) {
          failures.push({ index: i, error: validationError, payload: raw });
          continue;
        }

        if (user.role === "team-member" && user.region !== "all" && !teamRegions.includes(regionValue)) {
          failures.push({
            index: i,
            error: `You are not allowed to add school in region "${regionValue}"`,
            payload: raw,
          });
          continue;
        }

        const key = makeDeDupeKey(payload);
        if (seen.has(key)) {
          failures.push({
            index: i,
            error: "Duplicate row in the same file (same schoolName+branch+region+district).",
            payload: raw,
          });
          continue;
        }

        seen.add(key);
        toInsert.push({ rawIdx: i, payload, key });
      } catch (err: any) {
        failures.push({ index: i, error: err?.message || "Unknown error", payload: raw });
      }
    }

    if (toInsert.length === 0) {
      return NextResponse.json(
        {
          message: "No valid rows to insert",
          summary: { total: schools.length, inserted: 0, failed: failures.length },
          successes,
          failures,
        },
        { status: 400 }
      );
    }

    // ---------- 2) Check DB for already existing docs (DB DE-DUPE) ----------
    const orConditions = toInsert.map(({ payload }) => ({
      schoolName: payload.schoolName,
      branch: payload.branch,
      region: payload.region,
      district: payload.district,
    }));

    const existing = await School.find(
      { $or: orConditions },
      { schoolName: 1, branch: 1, region: 1, district: 1 }
    ).lean();

    const existingSet = new Set<string>(
      existing.map((s: any) =>
        makeDeDupeKey({
          schoolName: s.schoolName,
          branch: s.branch,
          region: s.region,
          district: s.district,
        })
      )
    );

    // filter out the ones already in DB
    const filtered = toInsert.filter(({ key, rawIdx, payload }) => {
      if (existingSet.has(key)) {
        failures.push({
          index: rawIdx,
          error: "Duplicate school (already exists in DB with same schoolName+branch+region+district)",
          payload,
        });
        return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      return NextResponse.json(
        {
          message: "All rows already exist in DB (nothing inserted)",
          summary: { total: schools.length, inserted: 0, failed: failures.length },
          successes,
          failures,
        },
        { status: 200 }
      );
    }

    // ---------- 3) Finally, sequential insert with schoolId generation ----------
    for (const item of filtered) {
      const { rawIdx, payload } = item;
      try {
        // Use region + district (7-digit pattern)
        payload.schoolId = await generateSchoolId(payload.region, payload.district);
        payload.createdBy = userId;
        payload.addedBy = userId;
        payload.createdAt = new Date();
        payload.studentsCount = 0;
        payload.paymentVerification = 0;

        const saved = await School.create(payload);
        // Create coordinator record (if coordinator info is present)
        if (payload.coordinatorName && payload.coordinatorPhone) {
          await SchoolCoordinator.create({
            name: payload.coordinatorName,
            phone: payload.coordinatorPhone,
            email: payload.coordinatorEmail,
            schoolId: saved._id,
            school_id: payload.schoolId,
          });
        }
        const existingCoordinator = await SchoolCoordinator.findOne({
          phone: payload.coordinatorPhone,
          schoolId: saved._id,
        });
        if (!existingCoordinator) {
          await SchoolCoordinator.create({
            schoolId: saved._id,
            name: payload.coordinatorName,
            phone: payload.coordinatorPhone,
            email: payload.coordinatorEmail || "",
            createdBy: userId,
          });
        }
        successes.push({
          index: rawIdx,
          _id: saved._id.toString(),
          schoolId: saved.schoolId,
          schoolName: saved.schoolName,
        });
      } catch (err: any) {
        failures.push({
          index: rawIdx,
          error: err?.message || "Unknown error during save",
          payload,
        });
      }
    }

    return NextResponse.json(
      {
        message:
          successes.length > 0
            ? "Bulk upload completed with some results"
            : "No schools were inserted",
        summary: {
          total: schools.length,
          validated: toInsert.length,
          filteredByDB: toInsert.length - filtered.length,
          inserted: successes.length,
          failed: failures.length,
        },
        successes,
        failures,
      },
      { status: successes.length > 0 ? 201 : 400 }
    );
  } catch (err: any) {
    console.error("POST /api/schools/bulk error:", err);
    return NextResponse.json({ error: err?.message || "Failed to add schools" }, { status: 500 });
  }
}