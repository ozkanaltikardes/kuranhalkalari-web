import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Eğer kullanıcı sadece "/" (ana sayfa) adresine girdiyse
  if (pathname === "/") {
    // Onu "/tr" adresine yönlendir
    return NextResponse.redirect(new URL("/tr", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Aşağıdaki yollar hariç tüm istekleri eşleştir:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};