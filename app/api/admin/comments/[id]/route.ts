import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: Request, context: RouteContext) {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertCsrf(request);
  } catch (error) {
    return NextResponse.json({ error: "CSRF token неверен" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { status } = body as { status?: string };

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  }

  const updated = await prisma.comment
    .update({
      where: { id: context.params.id },
      data: { status },
      select: { id: true, status: true },
    })
    .catch(() => null);

  if (!updated) {
    return NextResponse.json({ error: "Комментарий не найден" }, { status: 404 });
  }

  return NextResponse.json({ success: true, comment: updated });
}
