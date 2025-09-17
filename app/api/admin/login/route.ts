import { NextResponse } from "next/server";
import { clearAdminSession, setAdminSession } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    assertCsrf(request);
  } catch (error) {
    return NextResponse.json({ error: "CSRF token неверен" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };

  if (!password) {
    return NextResponse.json({ error: "Пароль обязателен" }, { status: 400 });
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "ADMIN_SECRET не настроен" }, { status: 500 });
  }

  if (password !== secret) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  setAdminSession();

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  try {
    assertCsrf(request);
  } catch (error) {
    return NextResponse.json({ error: "CSRF token неверен" }, { status: 403 });
  }

  clearAdminSession();
  return NextResponse.json({ success: true });
}
