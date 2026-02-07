import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Essay } from "@/utils/models/Reynolds";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    // Form data extract karna
    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const age = formData.get("age") as string;
    const school = formData.get("school") as string;
    const studentClass = formData.get("class") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;

    // Student ka unique identifier banaye (name + timestamp ya phone number)
    const studentIdentifier = `${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`;
    
    // Essay file handle karna
    const essayFile = formData.get("essay") as File;
    if (!essayFile) {
      return NextResponse.json({ message: "Essay file is required" }, { status: 400 });
    }

    const essayBuffer = Buffer.from(await essayFile.arrayBuffer());
    const essayUploadDir = path.join(process.cwd(), "uploads/essays");
    if (!fs.existsSync(essayUploadDir)) {
      fs.mkdirSync(essayUploadDir, { recursive: true });
    }

    // Essay file name student ke naam se
    const essayFileName = `${studentIdentifier}_essay${path.extname(essayFile.name)}`;
    const essayFilePath = path.join(essayUploadDir, essayFileName);
    fs.writeFileSync(essayFilePath, essayBuffer);

    // Selfie file handle karna
    const selfieFile = formData.get("selfie") as File;
    if (!selfieFile) {
      return NextResponse.json({ message: "Selfie file is required" }, { status: 400 });
    }

    const selfieBuffer = Buffer.from(await selfieFile.arrayBuffer());
    const selfieUploadDir = path.join(process.cwd(), "uploads/selfies");
    if (!fs.existsSync(selfieUploadDir)) {
      fs.mkdirSync(selfieUploadDir, { recursive: true });
    }

    // Selfie file name student ke naam se
    const selfieFileName = `${studentIdentifier}_selfie${path.extname(selfieFile.name)}`;
    const selfieFilePath = path.join(selfieUploadDir, selfieFileName);
    fs.writeFileSync(selfieFilePath, selfieBuffer);

    // Database mein entry create karna
    await Essay.create({
      name: name,
      gender: gender,
      age: age,
      school: school,
      class: studentClass,
      phone: phone,
      location: location,
      essayFile: `/uploads/essays/${essayFileName}`,
      selfieFile: `/uploads/selfies/${selfieFileName}`,
      agreed: true,
    });

    return NextResponse.json({ 
      message: "Form submitted successfully",
      files: {
        essay: essayFileName,
        selfie: selfieFileName
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}