import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const token = request.cookies.get('token')?.value;

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/acceso', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};