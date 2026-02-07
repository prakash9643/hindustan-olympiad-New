import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { School } from "@/utils/models/School";

connectDB().catch(console.error);

const CHUNK_SIZE = 5000;

async function insertInChunks(docs: any[], chunkSize = 5000) {
  const inserted: any[] = [];

  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    const res = await Student.insertMany(chunk, { ordered: false });
    inserted.push(...res);
  }

  return inserted;
}

export async function POST(req: NextRequest) {
  try {
    const { students } = await req.json();

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: "students array is required" },
        { status: 400 }
      );
    }

    // -----------------------------
    // GROUP BY SCHOOL ID
    // -----------------------------
    const studentsBySchool: Record<string, any[]> = {};
    const schoolIds = Array.from(new Set(students.map((s) => s.schoolId)));

    const schools = await School.find({ schoolId: { $in: schoolIds } });

    const schoolMap: Record<string, any> = {};
    schools.forEach((school) => {
      schoolMap[school.schoolId] = school;
    });

    // -----------------------------
    // RESULT OBJECT
    // -----------------------------
    const results = {
      inserted: [] as any[],
      skippedDuplicates: [] as { schoolId: string; name: string; reason: string }[],
      skippedInvalidSchools: [] as { schoolId: string; name: string }[],
      errors: [] as { schoolId: string; schoolName: string; error: string }[],
      schoolUpdates: [] as {
        schoolId: string;
        schoolName: string;
        studentsAdded: number;
        paymentConfirmed: number;
      }[],
    };

    // -----------------------------
    // FILTER INVALID SCHOOL IDS
    // -----------------------------
    for (const student of students) {
      if (!schoolMap[student.schoolId]) {
        results.skippedInvalidSchools.push({
          schoolId: student.schoolId,
          name: student.name,
        });
        continue;
      }

      if (!studentsBySchool[student.schoolId]) {
        studentsBySchool[student.schoolId] = [];
      }

      studentsBySchool[student.schoolId].push(student);
    }

    // -----------------------------
    // PROCESS EACH SCHOOL
    // -----------------------------
    for (const schoolId of Object.keys(studentsBySchool)) {
      const school = schoolMap[schoolId];
      const schoolStudents = studentsBySchool[schoolId];

      try {
        let paymentConfirmed = 0;
        const bulkDocs: any[] = [];

        for (const s of schoolStudents) {
          // -----------------------------
          // DUPLICATE CHECK
          // -----------------------------
          const existing = await Student.findOne({
            schoolId: s.schoolId,
            name: s.name?.trim(),
            parentContact: s.parentContact?.trim(),
            class: s.class?.trim(),
            // studentId: s.studentId?.trim(),
          });

          if (existing) {
            results.skippedDuplicates.push({
              schoolId: s.schoolId,
              name: s.name,
              reason: "Duplicate student",
            });
            continue;
          }

          const studentDoc = {
            batchId: Date.now().toString(),
            name: s.name,
            class: s.class,
            section: s.section,
            gender: s.gender,
            stream: s.stream,
            parentName: s.parentName,
            parentContact: s.parentContact,
            addedBy: s.addedBy,
            studentId: s.studentId,
            rollNumber: s.rollNumber,
            schoolId: school.schoolId,
            schoolName: school.schoolName,
            branch: school.branch,
            district: school.district,
            region: school.region,
            city: school.city || s.city || "",
            pincode: school.pincode || "",
            // Source_code: s.Source_code,
            paymentVerified: s.paymentVerified || false,
          };

          if (s.paymentVerified) paymentConfirmed++;
          bulkDocs.push(studentDoc);
        }

        // -----------------------------
        // INSERT IN CHUNKS (5000)
        // -----------------------------
        const inserted = await insertInChunks(bulkDocs, CHUNK_SIZE);

        // -----------------------------
        // UPDATE SCHOOL COUNTS
        // -----------------------------
        if (inserted.length > 0) {
          await School.updateOne(
            { _id: school._id },
            {
              $inc: {
                studentsCount: inserted.length,
                paymentVerification: paymentConfirmed,
              },
            }
          );
        }

        results.inserted.push(...inserted);
        results.schoolUpdates.push({
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          studentsAdded: inserted.length,
          paymentConfirmed,
        });
      } catch (error) {
        results.errors.push({
          schoolId,
          schoolName: school.schoolName,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // -----------------------------
    // FINAL RESPONSE
    // -----------------------------
    return NextResponse.json(
      {
        message: "Bulk students uploaded successfully",
        summary: {
          totalInserted: results.inserted.length,
          duplicatesSkipped: results.skippedDuplicates.length,
          invalidSchoolSkipped: results.skippedInvalidSchools.length,
          totalSchoolsProcessed: results.schoolUpdates.length,
          totalErrors: results.errors.length,
        },
        details: results,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to upload students" },
      { status: 500 }
    );
  }
}
