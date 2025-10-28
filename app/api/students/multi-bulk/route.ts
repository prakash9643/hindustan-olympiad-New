import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { School } from "@/utils/models/School";

connectDB().catch(console.error);

function generateStudentId(schoolId: string, rollNumber: string) {
  const schoolPart = schoolId.replace(/-/g, ""); // Remove dashes
  const rollStr = rollNumber.toString().padStart(4, "0");
  return `${schoolPart}${rollStr}`;
}

export async function POST(req: NextRequest) {
  try {
    const { students } = await req.json();
    
    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "students array is required" }, { status: 400 });
    }

    // Group students by schoolId
    const studentsBySchool: Record<string, any[]> = {};
    const schoolIds = Array.from(new Set(students.map(s => s.schoolId)));
    
    // Validate all schools exist
    const schools = await School.find({ schoolId: { $in: schoolIds } });

    // School map create karein schoolId ke basis pe
    const schoolMap: Record<string, typeof schools[0]> = {};
    schools.forEach(school => {
    schoolMap[school.schoolId] = school; // schoolId as key use karein
    });

    // Check if all school IDs are valid
    const invalidSchoolIds = schoolIds.filter(id => !schoolMap[id]);
    if (invalidSchoolIds.length > 0) {
      return NextResponse.json({ 
        error: "Invalid school IDs found", 
        invalidSchoolIds 
      }, { status: 404 });
    }

    // Group students by school
    students.forEach(student => {
      if (!studentsBySchool[student.schoolId]) {
        studentsBySchool[student.schoolId] = [];
      }
      studentsBySchool[student.schoolId].push(student);
    });

    const results: {
      inserted: any[];
      errors: { schoolId: string; schoolName: string; error: string }[];
      schoolUpdates: { schoolId: string; schoolName: string; studentsAdded: number; paymentConfirmed: number }[];
    } = {
      inserted: [],
      errors: [],
      schoolUpdates: []
    };

    // Process each school's students
    for (const schoolId of Object.keys(studentsBySchool)) {
      const school = schoolMap[schoolId];
      const schoolStudents = studentsBySchool[schoolId];

      try {
        // Get last roll number for this school
        const lastStudent = await Student.find({ schoolId: school.schoolId })
          .sort({ studentId: -1 })
          .limit(1);

        let currentRoll = 1;
        if (lastStudent.length > 0) {
          const lastRoll = parseInt(lastStudent[0].studentId.slice(-4));
          currentRoll = lastRoll + 1;
        }

        let paymentConfirmed = 0;
        const bulkDocs = schoolStudents.map((s) => {
          const roll = currentRoll.toString().padStart(4, "0");
          const studentId = generateStudentId(school.schoolId, roll);

          const studentDoc = {
            name: s.name,
            class: s.class,
            section: s.section,
            gender: s.gender,
            stream: s.stream,
            parentName: s.parentName,
            parentContact: s.parentContact,
            addedBy: s.addedBy,
            studentId: studentId,
            rollNumber: roll,
            schoolId: school.schoolId,
            schoolName: school.schoolName,
            branch: school.branch,
            district: school.district,
            region: school.region,
            city: school.city || s.city || "",
            pincode: school.pincode || "",
            paymentVerified: s.paymentVerified || false,
          };

          currentRoll += 1;
          paymentConfirmed = s.paymentVerified ? paymentConfirmed + 1 : paymentConfirmed;
          return studentDoc;
        });

        // Insert students for this school
        const inserted = await Student.insertMany(bulkDocs);
        
        // Update school student count
        await School.updateOne(
          { _id: school._id }, 
          { 
            $inc: { 
              studentsCount: inserted.length,
              paymentVerification: paymentConfirmed
            } 
          }
        );

        results.inserted.push(...inserted);
        results.schoolUpdates.push({
          schoolId: school._id,
          schoolName: school.schoolName,
          studentsAdded: inserted.length,
          paymentConfirmed: paymentConfirmed
        });

      } catch (error) {
        results.errors.push({
          schoolId: schoolId,
          schoolName: school.schoolName,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    return NextResponse.json({ 
      message: "Bulk students processing completed", 
      summary: {
        totalInserted: results.inserted.length,
        totalSchools: results.schoolUpdates.length,
        totalErrors: results.errors.length
      },
      details: {
        inserted: results.inserted,
        schoolUpdates: results.schoolUpdates,
        errors: results.errors
      }
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add students" }, { status: 500 });
  }
}