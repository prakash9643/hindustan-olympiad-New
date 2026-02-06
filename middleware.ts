// middleware.js - Next.js middleware
// import { NextResponse, NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const isLiveHindustan = request.headers.get('referer')?.includes('https://www.livehindustan.com/');
    
//     if (isLiveHindustan) {
//         // Rewrite to hindustanolympiad path
//         const url = request.nextUrl.clone();
//         url.pathname = url.pathname + '/hindustanolympiad';
//         return NextResponse.rewrite(url);
//     }
    
//     return NextResponse.next();
// }

import { NextRequest, NextResponse } from "next/server";
import { verifyResultToken } from "@/utils/jwt";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("result_token")?.value;
  const pathname = req.nextUrl.pathname;

  // 🔒 Protect only /Result/[rollNumber]
  if (pathname.startsWith("/Result/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/Result", req.url));
    }

    try {
      const payload: any = verifyResultToken(token);
      const urlStudentId = pathname.split("/")[2];

      if (payload.studentId !== urlStudentId) {
        return NextResponse.redirect(new URL("/Result", req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/Result", req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/Result/:studentId"],
};



