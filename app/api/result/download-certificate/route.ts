import { NextResponse } from "next/server";
import { verifyResultToken } from "@/utils/jwt";
import { cookies } from "next/headers";

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("result_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyResultToken(token);
    const studentId = payload.studentId;

    if (!studentId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const key = `certificates/${studentId}.pdf`;

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ url: signedUrl });

  } catch (err) {
    console.error("❌ Certificate Download Error:", err);

    return NextResponse.json(
      { message: "Unauthorized or expired session" },
      { status: 401 }
    );
  }
}