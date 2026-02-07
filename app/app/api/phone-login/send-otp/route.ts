import { sendOTP } from "@/lib/sendSMS";
import { connectDB } from "@/utils/config/dbConfig";
import { SchoolCoordinator } from "@/utils/models/SchoolCoordinator";
import { TeamMember } from "@/utils/models/team-members";
import { NextRequest, NextResponse } from "next/server";


connectDB().catch(console.error);

function generateOTP() {
  const otp = Math.floor(Math.random() * 1000000).toString();
  return otp.padStart(6, '0');
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { mobile, type } = data;
    if(mobile === "" || type === "") {
        return NextResponse.json({ error: "Mobile number and type are required" }, { status: 400 });
    }

    if(mobile.length !== 10) {
        return NextResponse.json({ error: "Mobile number should be 10 digits" }, { status: 400 });
    }


    if (type !== "school-coordinator" && type !== "team-member") {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    
    if(type === "school-coordinator") {
        // Check if mobile is registered as school coordinator
        const schoolCoordinator = await SchoolCoordinator.findOne({ phone:mobile });
        if (!schoolCoordinator) {
            return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
        }
        var otp = generateOTP();
        if(schoolCoordinator.lastOTPSent && schoolCoordinator.lastOTPSent.getTime() + 1000 * 60 > new Date().getTime()) {
            return NextResponse.json({ error: "OTP already sent" }, { status: 400 });
        }
        if(schoolCoordinator.lastOTPSent && schoolCoordinator.lastOTPSent.getTime() + 1000 * 60 * 10 > new Date().getTime()) {
            otp = schoolCoordinator.OTP;
        }
        schoolCoordinator.OTP = otp;
        schoolCoordinator.lastOTPSent = new Date();
        console.log("OTP sent to school coordinator :" , otp);
        const res = await sendOTP(schoolCoordinator.phone, otp);
        await schoolCoordinator.save();
        return NextResponse.json({ message: "OTP sent" , res}, { status: 200 });
    }

    else if(type === "team-member") {
        // Check if mobile is registered as team member
        const teamMember = await TeamMember.findOne({ phone: mobile });
        if (!teamMember) {
            return NextResponse.json({ error: "Invalid mobile" }, { status: 400 });
        }
        var otp = generateOTP();
        if(teamMember.lastOTPSent && teamMember.lastOTPSent.getTime() + 1000 * 60 > new Date().getTime()) {
            return NextResponse.json({ error: "OTP already sent please wait for one minute" }, { status: 400 });
        }
        if(teamMember.lastOTPSent && teamMember.lastOTPSent.getTime() + 1000 * 60 * 10 > new Date().getTime()) {
            otp = teamMember.OTP;
        }
        teamMember.OTP = otp;
        teamMember.lastOTPSent = new Date();
        console.log("OTP sent to team member :" , otp);
        const res = await sendOTP(teamMember.phone, otp);
        await teamMember.save();
        return NextResponse.json({ message: "OTP sent" ,  res}, { status: 200 });
    }
}