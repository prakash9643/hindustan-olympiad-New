import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Essay } from "@/utils/models/Reynolds";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const file = formData.get("essay") as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "uploads/essays");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    await Essay.create({
      name: formData.get("name"),
      gender: formData.get("gender"),
      age: formData.get("age"),
      school: formData.get("school"),
      class: formData.get("class"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      essayFile: filePath,
      selfieFile: filePath, // Placeholder, implement selfie upload similarly
      agreed: true,
    });

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}
