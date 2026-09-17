import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Explicit Exclusions:
  // - Public lead-capture endpoint: /api/public/*, /api/leads/capture
  // - Unsubscribe endpoints: /api/unsubscribe, /unsubscribe
  // - Vercel cron endpoints: /api/cron/*
  // - NextAuth authentication routes: /api/auth/*
  // - Resend webhooks: /api/webhooks/*
  // - Next.js internal static assets & favicon
  // - Login page itself: /login
  if (
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/api/leads/capture") ||
    pathname.startsWith("/api/unsubscribe") ||
    pathname.startsWith("/unsubscribe") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Validate session token via NextAuth JWT
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "nextauth-secret-123",
  });

  // 3. Unauthenticated handling
  if (!token) {
    // Return 401 for unauthenticated API endpoints
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required." },
        { status: 401 }
      );
    }

    // Redirect unauthenticated page requests to /login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files with extensions (.png, .jpg, .svg, .ico, etc.)
     */
    "/((?!.*\\.[\\w]+$).*)",
  ],
};
