import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;

    // ── /admin/* → sadece admin rolü ──────────────────────────────────────────
    if (path.startsWith('/admin')) {
        if (!token) {
            const url = new URL('/giris', request.url);
            url.searchParams.set('redirect', path);
            return NextResponse.redirect(url);
        }
        if (role !== 'admin') {
            // Moderatörse kendi paneline yönlendir
            if (role === 'moderator') {
                return NextResponse.redirect(new URL('/moderator', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // ── /moderator/* → moderatör veya admin rolü ──────────────────────────────
    if (path.startsWith('/moderator')) {
        if (!token) {
            const url = new URL('/giris', request.url);
            url.searchParams.set('redirect', path);
            return NextResponse.redirect(url);
        }
        if (role !== 'moderator' && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/moderator/:path*'],
};
