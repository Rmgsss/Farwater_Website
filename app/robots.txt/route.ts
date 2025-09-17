﻿import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
