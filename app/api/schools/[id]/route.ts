import { connectDB } from "@/utils/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { School } from "@/utils/models/School";
import { Student } from "@/utils/models/Student";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { TeamMember } from "@/utils/models/team-members";
import { checkForAccessOfSchool } from "@/lib/checkForAccess";
import { ActivityLog } from "@/utils/models/ActivityLogs";

connectDB().catch(console.error);

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    const headers = req.headers;
    const authorization = headers.get("authorization") || "";
    const { access, message, user, school } = await checkForAccessOfSchool(authorization, params.id, "GET");
    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json(school);

}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;
    const headers = req.headers;
    const data = await req.json();
    if(!id){
        return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const { access, message, user, school } = await checkForAccessOfSchool(headers.get("authorization") || "", id, data.confirmPayment ? "PAYMENT_VERIFICATION" : "PUT");
    
    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

    if (data && data.confirmPayment && data.confirmPayment === true && id) {
        if (user?.role !== "finance") {
            return NextResponse.json({ error: "Forbidden - Only finance team can verify payments" }, { status: 403 });
        }
        const existingSchool = school;
        if(user?.role !== "finance") {
            return NextResponse.json({ error: "Only team members can confirm payment verification" }, { status: 401 });
        }

        if (!existingSchool) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        existingSchool.paymentVerification = existingSchool.studentsCount;
        await existingSchool.save();

        const students = await Student.updateMany(
            { schoolId: existingSchool.schoolId },
            { paymentVerified: true, paymentVerifiedBy: user?._id  }
        );
        console.log(students);

        await ActivityLog.create({
            schoolId: existingSchool.schoolId,            
            userId: user._id.toString(),
            action: "PAYMENT_VERIFICATION",
            description: `Payment verified for school ${existingSchool?.schoolName} by ${user.name || user.email}`,
        });

        return NextResponse.json({ message: "Payment verified" }, { status: 200 });
    }

    if (!data.schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    let existing;
    if (id.length === 7) {
        existing = await School.findOne({ schoolId: id });
        if (!existing)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    else {
        existing = await School.findOne({ _id: id });
        if (!existing)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!existing) {
        throw new Error("School not found");
    }

    // Only update fields that have changed
    const updatedFields: any = {};
    for (const key in data) {
        if (key === "schoolId" || key === "_id" || key === "__v" || key === "updatedAt" || key === "createdAt" || key === "studentsCount" || key === "paymentVerification") continue;
        if (data[key] !== undefined && data[key] !== existing[key]) {
            updatedFields[key] = data[key];
        }
    }

    if (updatedFields.coordinatorPhone || updatedFields.coordinatorEmail || updatedFields.coordinatorName) {

        const schoolCoordinator = await SchoolCoordinator.findOne({ schoolId: existing._id });
        if (!schoolCoordinator) {
            throw new Error("School coordinator not found");
        }

        if (updatedFields.coordinatorPhone) {
            schoolCoordinator.phone = updatedFields.coordinatorPhone;
        }
        if (updatedFields.coordinatorEmail) {
            schoolCoordinator.email = updatedFields.coordinatorEmail;
        }
        if (updatedFields.coordinatorName) {
            schoolCoordinator.name = updatedFields.coordinatorName;
        }

        await schoolCoordinator.save();
    }

    console.log(updatedFields);

    // Only update if there are changes
    let updated = existing;
    if (Object.keys(updatedFields).length > 0) {
        updated = await School.findByIdAndUpdate(
            existing._id,
            { $set: updatedFields },
            { new: true }
        );
        await ActivityLog.create({
            schoolId: existing?.schoolId,
            userId: user._id.toString(),
            action: "SCHOOL_UPDATE",
            description: `School ${existing.schoolId} updated by ${user?.name}`,
        });
    }

    return NextResponse.json({ updated }, { status: 200 });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }) {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const headers = req.headers;
    const authorization = headers.get("authorization") || "";
    const { access, message, user, school,} = await checkForAccessOfSchool(authorization, id, "DELETE");
    if (!access) {
        return NextResponse.json({ error: message }, { status: 401 });
    }

     // ✅ Role-based delete protection
    const allowedDeleteRoles = ["admin", "finance"];
    if (!allowedDeleteRoles.includes(user?.role?.toLowerCase?.())) {
    return NextResponse.json({ error: "You are not allowed to delete schools" }, { status: 403 });
    }

    const deleted = await School.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await Student.deleteMany({ schoolId: deleted.schoolId });

    await SchoolCoordinator.deleteOne({ schoolId: deleted._id });
    await ActivityLog.create({
        schoolId: deleted.schoolId,
        userId: user._id.toString(),
        action: "SCHOOL_DELETE",
        description: `Deleted school ${deleted.name} (${deleted._id})`,
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
