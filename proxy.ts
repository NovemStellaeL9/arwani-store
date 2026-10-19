import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // If Ruang Kuota posts to root '/' as configured in Webhook URL
  if (request.method === "POST" && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/webhook";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};

