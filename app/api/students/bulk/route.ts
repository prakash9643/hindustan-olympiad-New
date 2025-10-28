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
      const { students, schoolId } = await req.json();
      
      if (!Array.isArray(students) || students.length === 0 || !schoolId) {
        return NextResponse.json({ error: "students array and schoolId are required" }, { status: 400 });
      }
  
      const school = await School.findById(schoolId);
      if (!school) {
        return NextResponse.json({ error: "Invalid schoolId" }, { status: 404 });
      }
  
      // Get last roll number used for this school
      const lastStudent = await Student.find({ schoolId: school.schoolId })
        .sort({ studentId: -1 })
        .limit(1);
  
      let currentRoll = 1;
      if (lastStudent.length > 0) {
        console.log(lastStudent[0])
        const lastRoll = parseInt(lastStudent[0].studentId.slice(-4));
        currentRoll = lastRoll + 1;
      }
      let paymentConfirmed = 0;
  
      const bulkDocs = students.map((s) => {
        const roll = currentRoll.toString().padStart(4, "0");
        const studentId = generateStudentId(school.schoolId, roll);
  
        const studentDoc = {
          ...s,
          studentId: studentId,
          rollNumber: roll,
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          branch: school.branch,
          district: school.district,
          region: school.region,
          city: school.city || s.city || "",
          pincode: school.pincode || "",
        };
  
        currentRoll += 1;
        paymentConfirmed = s.paymentVerified ? paymentConfirmed + 1 : paymentConfirmed;
        return studentDoc;
      });

  
      const inserted = await Student.insertMany(bulkDocs);

      // Increment the number of students in the School
      await School.updateOne({ _id: school._id }, { $inc: { studentsCount: inserted.length } });
      await School.updateOne({ _id: school._id }, { $inc: { paymentVerification: paymentConfirmed } });
  
      return NextResponse.json({ message: "Students added successfully", data: inserted }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ error: err.message || "Failed to add students" }, { status: 500 });
    }
  }
  