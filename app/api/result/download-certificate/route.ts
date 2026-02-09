import { NextResponse } from "next/server";
import { verifyResultToken } from "@/utils/jwt";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 🔐 1. Read token
    const token = cookies().get("result_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔐 2. Verify token
    const payload: any = verifyResultToken(token);
    const studentId = payload.studentId;

    if (!studentId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 🔒 3. SAFE PATH (no user input)
    const baseDir = path.join(process.cwd(), "secure-files", "certificate");
    const filePath = path.join(baseDir, `${studentId}.pdf`);

    // 🛡 Prevent path traversal (extra hardening)
    if (!filePath.startsWith(baseDir)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // 📄 4. File exists?
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    // 📦 5. Read file
    const fileBuffer = fs.readFileSync(filePath);

    // 🚀 6. Send PDF securely
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${studentId}_certificate.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error("❌ Certificate Download Error:", err);
    return NextResponse.json(
      { message: "Unauthorized or expired session" },
      { status: 401 }
    );
  }
}
