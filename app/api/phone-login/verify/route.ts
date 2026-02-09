import { connectDB } from "@/utils/config/dbConfig";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { TeamMember } from "@/utils/models/team-members";
import { NextRequest, NextResponse } from "next/server";

connectDB().catch(console.error);

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { mobile, otp, type } = data;
    if (type !== "school-coordinator" && type !== "team-member") {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    
    if(type === "school-coordinator") {
        // Check if mobile is registered as school coordinator
        const schoolCoordinator = await SchoolCoordinator.findOne({ phone:mobile });
        if (!schoolCoordinator) {
            return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
        }

        // Check if otp is correct
        if (schoolCoordinator.OTP !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // Create a new object without sensitive OTP information
        const { OTP, lastOTPSent, ...safeCoordinatorData } = schoolCoordinator.toObject();
        
        return NextResponse.json({ message: "Verified", user: safeCoordinatorData }, { status: 200 });
    }

    else if(type === "team-member") {
        // Check if mobile is registered as team member
        const teamMember = await TeamMember.findOne({ phone: mobile });
        if (!teamMember) {
            return NextResponse.json({ error: "Invalid mobile" }, { status: 400 });
        }

        // Check if otp is correct
        if (teamMember.OTP !== otp) {
            return NextResponse.json({ error: "Invalid otp" }, { status: 400 });
        }
        
        // Create a new object without sensitive OTP information
        const { OTP, lastOTPSent, ...safeTeamMemberData } = teamMember.toObject();        

        return NextResponse.json({ message: "Verified" , user: safeTeamMemberData }, { status: 200 });
    }

}
