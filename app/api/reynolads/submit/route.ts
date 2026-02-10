import { NextResponse } from "next/server";
import { connectDB } from "@/utils/config/dbConfig";
import { Essay } from "@/utils/models/Reynolds";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const gender = formData.get("gender") as string;
    const age = formData.get("age") as string;
    const school = formData.get("school") as string;
    const studentClass = formData.get("class") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;

    const studentIdentifier = `${name.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}`;

    // ===== ESSAY =====
    const essayFile = formData.get("essay") as File;
    if (!essayFile) {
      return NextResponse.json({ message: "Essay required" }, { status: 400 });
    }

    const essayDir = path.join(process.cwd(), "public/uploads/essays");
    await fs.mkdir(essayDir, { recursive: true });

    const essayName = `${studentIdentifier}_essay${path.extname(essayFile.name)}`;
    const essayPath = path.join(essayDir, essayName);

    await fs.writeFile(essayPath, Buffer.from(await essayFile.arrayBuffer()));

    // ===== SELFIE =====
    const selfieFile = formData.get("selfie") as File;
    if (!selfieFile) {
      return NextResponse.json({ message: "Selfie required" }, { status: 400 });
    }

    const selfieDir = path.join(process.cwd(), "public/uploads/selfies");
    await fs.mkdir(selfieDir, { recursive: true });

    const selfieName = `${studentIdentifier}_selfie${path.extname(selfieFile.name)}`;
    const selfiePath = path.join(selfieDir, selfieName);

    await fs.writeFile(selfiePath, Buffer.from(await selfieFile.arrayBuffer()));

    await Essay.create({
      name,
      gender,
      age,
      school,
      class: studentClass,
      phone,
      location,
      essayFile: `/uploads/essays/${essayName}`,
      selfieFile: `/uploads/selfies/${selfieName}`,
      agreed: true,
    });

    return NextResponse.json({ message: "Submitted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}
