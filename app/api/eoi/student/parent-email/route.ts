import { NextRequest, NextResponse } from "next/server";
import { SendSmtpEmail } from "@getbrevo/brevo";
import brevoClient from "@/utils/models/brevoClient";

function formatDateToDDMMYYYY(input?: string | null) {
  if (!input) return "NA";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "NA";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.parentEmail || !body.parentName) {
      return NextResponse.json({ error: "Parent email and name are required" }, { status: 400 });
    }

    // Format DOB to dd/mm/yyyy (or NA)
    const formattedDOB = formatDateToDDMMYYYY(body.dateOfBirth);

    // Ensure stream shows "NA" for classes <= 10
    const cls = body.class !== undefined && body.class !== null ? parseInt(String(body.class), 10) : NaN;
    const streamParam = (!Number.isNaN(cls) && (cls === 11 || cls === 12)) ? (body.stream || "NA") : "NA";

    // Region fallback
    // const schoolRegion = body.region || "NA";

    const sendSmtpEmail = new SendSmtpEmail();

    sendSmtpEmail.to = [{ email: body.parentEmail, name: body.parentName }];
    sendSmtpEmail.sender = {
      email: "response@hindustanolympiad.in",
      name: "Hindustan Olympiad",
    };
    sendSmtpEmail.templateId = 2; // as before

    // Params for template (use formatted values)
    sendSmtpEmail.params = {
      city: body.city || "NA",
      name: body.name || "NA",
      class: body.class || "NA",
      stream: streamParam,
      section: body.section || "NA",
      gender: body.gender || "NA",
      dateOfBirth: formattedDOB,
      parentName: body.parentName || "NA",
      realation: body.relationshipWithStudent || "NA",
      parentContact: body.parentContact || "NA",
      parentEmail: body.parentEmail || "NA",
      schoolName: body.schoolName || "NA",
      schoolRegion: body.region || "NA",
      schoolDistrict: body.schoolDistrict || "NA",
      schoolBranch: body.schoolBranch || "NA",
      schoolAddress: body.schoolAddress || "NA",
      orderId: body.orderId || "NA",
      transactionId: body.transactionId || "NA",
      studentId: body.studentId || "NA",
      amount: body.amount || "NA",
    };

    const result = await brevoClient.sendTransacEmail(sendSmtpEmail);

    return NextResponse.json({ message: "Email sent successfully", result }, { status: 200 });

  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}
