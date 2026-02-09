import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Student } from "@/utils/models/Student";
import { School } from "@/utils/models/School";
import { checkForAccessOfStudent } from "@/lib/checkForAccess";
import { ActivityLog } from "@/utils/models/ActivityLogs";

connectDB().catch(console.error);

export async function GET(req: NextRequest,
    { params }: { params: { id: string } }) {
    const id = params.id;
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";

    const { access, message, accessType, user, student } = await checkForAccessOfStudent(authorization, id, "GET");

    
    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }
    try {
        if (!id)
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        if (id.length === 11) {
            const student = await Student.findOne({ studentId: id });
            if (!student)
                return NextResponse.json({ error: "Can find student" }, { status: 404 });
            return NextResponse.json(student);
        }
        else {
            const student = await Student.findById(id);
            if (!student)
                return NextResponse.json({ error: "Can find student" }, { status: 404 });
            return NextResponse.json(student);
        }
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch student", details: (error as Error).message },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";
    const { access, message, accessType, user } = await checkForAccessOfStudent(authorization, id, "DELETE");

    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

    const student = await Student.findById(id);
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete the student
    await Student.findByIdAndDelete(id);

    // Decrement the student count from the school
    const school = await School.findOne({ schoolId: student.schoolId });
    if (!school) return NextResponse.json({ error: "Can't find school" }, { status: 500 });

    await school.updateOne({ $inc: { studentsCount: -1 } });
    if(student.paymentVerified === true){
        await school.updateOne({ $inc: { paymentVerifiedStudentsCount: -1 } });

        const updatedSchool = await School.findOne({ schoolId: student.schoolId });

        console.log("✅ School found?", !!updatedSchool);
        console.log("✅ Full School Data:", updatedSchool);
        if (updatedSchool && (updatedSchool.paymentVerifiedStudentsCount ?? 0) <= 0) {
            updatedSchool.paymentVerification = 0;
            await updatedSchool.save();
            console.log("🛠️ Set paymentVerification = 0");
        }
    }
    await ActivityLog.create({
        schoolId: school.schoolId,
        userId: user._id.toString(),
        action: "STUDENT_DELETE",
        description: `Deleted student ${student.name} (${student.studenId}) from school`,
    });
    

    return NextResponse.json({ message: "Deleted" });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const data = await req.json();
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";

    const { access, message, accessType, user , student } = await checkForAccessOfStudent(authorization, id, "PUT");

    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

    if (!data.schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    if(!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    if(data && data.confirmPayment && data.confirmPayment === true){
        if (user?.role !== "finance") {
            return NextResponse.json({ error: "Forbidden - Only finance team can verify payments" }, { status: 403 });
        }
        const existingStudent = await Student.findById(id);
        const existingSchool = await School.findOne({ schoolId: student.schoolId});

        if (!existingStudent) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        existingStudent.paymentVerified = true;
        existingSchool.paymentVerification = 1;
        await existingStudent.save();
        await existingSchool.save();
        await ActivityLog.create({
            schoolId: existingStudent.schoolId,
            studentId: existingStudent.studentId,
            userId: user._id.toString(),
            action: "VERIFY_PAYMENT",
            description: `Payment verified for student ${existingStudent.name || existingStudent._id} by ${user?.name}`,
        });
        return NextResponse.json({ message: "Payment verified" }, { status: 200 });
    }

    const existing = await Student.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Only update fields that have changed
    const updatedFields: any = {};
    for (const key in data) {
        if (key === "schoolId" || key === "_id" || key === "__v" || key === "updatedAt" || key === "createdAt" || key === "studentId" || key === "schoolName" || key === "branch" || key === "district" || key === "region" || key === "city" || key === "pincode") continue;
        if (data[key] !== undefined && data[key] !== existing[key]) {
            updatedFields[key] = data[key];
        }
    }

    console.log(updatedFields);
    await Student.findByIdAndUpdate(existing._id, { $set: updatedFields }, { new: true });
    
    await ActivityLog.create({
        schoolId: student.schoolId,
        studentId: student.studentId,
        userId: user._id.toString(),
        action: "STUDENT_UPDATE",
        description: `Student ${student.studentId} updated by ${user?.name}`,
    });
    return NextResponse.json({ message: "Updated" } , { status: 200 });

}