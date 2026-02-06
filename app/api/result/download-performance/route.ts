import { NextResponse } from "next/server";
import { verifyResultToken } from "@/utils/jwt";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 🔐 1. Token from HttpOnly cookie
    const token = cookies().get("result_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔐 2. Verify JWT
    const payload: any = verifyResultToken(token);
    const studentId = payload?.studentId;

    if (!studentId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 🔒 3. Safe base directory
    const baseDir = path.join(process.cwd(), "secure-files", "performance");
    const filePath = path.join(baseDir, `${studentId}.pdf`);

    // 🛡 Extra safety against path traversal
    if (!filePath.startsWith(baseDir)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // 📄 4. File exists?
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "Performance report not found" },
        { status: 404 }
      );
    }

    // 📦 5. Read PDF
    const fileBuffer = fs.readFileSync(filePath);

    // 🚀 6. Secure response
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${studentId}_performance.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error("❌ Performance Download Error:", err);
    return NextResponse.json(
      { message: "Unauthorized or expired session" },
      { status: 401 }
    );
  }
}
