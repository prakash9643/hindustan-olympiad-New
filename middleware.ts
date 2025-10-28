// middleware.js - Next.js middleware
import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isLiveHindustan = request.headers.get('referer')?.includes('https://www.livehindustan.com/');
    
    if (isLiveHindustan) {
        // Rewrite to hindustanolympiad path
        const url = request.nextUrl.clone();
        url.pathname = url.pathname + '/hindustanolympiad';
        return NextResponse.rewrite(url);
    }
    
    return NextResponse.next();
}