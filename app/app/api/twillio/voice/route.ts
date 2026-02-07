import { NextResponse } from "next/server";

export async function POST() {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial callerId="+919876543210">
    <Number>+919876543210</Number>
  </Dial>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
