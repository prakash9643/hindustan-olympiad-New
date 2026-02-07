import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Essay } from "@/utils/models/Reynolds";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    // Upload your essay here *
    const file = formData.get("essay") as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "uploads/essays");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Upload your selfie holding a Reynolds Trimax pen here *
    const file1 = formData.get("selfie") as File;
    const buffer1 = Buffer.from(await file.arrayBuffer());

    const uploadDir1 = path.join(process.cwd(), "uploads/selfies");
    if (!fs.existsSync(uploadDir1)) fs.mkdirSync(uploadDir1, { recursive: true });

    const fileName1 = `${Date.now()}-${file1.name}`;
    const filePath1 = path.join(uploadDir1, fileName1);
    fs.writeFileSync(filePath1, buffer1);

    await Essay.create({
      name: formData.get("name"),
      gender: formData.get("gender"),
      age: formData.get("age"),
      school: formData.get("school"),
      class: formData.get("class"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      essayFile: filePath,
      selfieFile: filePath1, // Placeholder, implement selfie upload similarly
      agreed: true,
    });

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}
