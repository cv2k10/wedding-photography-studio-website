import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, packages } from "@/db/schema";
import { parseBookingInput } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式不正确" }, { status: 400 });
  }

  const parsed = parseBookingInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 422 });
  }
  const input = parsed.data;

  let packageName = "";
  if (input.packageId !== null) {
    const [pkg] = await db
      .select({ name: packages.name })
      .from(packages)
      .where(eq(packages.id, input.packageId))
      .limit(1);

    if (!pkg) {
      return NextResponse.json({ error: "所选套系不存在，请刷新后重试" }, { status: 422 });
    }
    packageName = pkg.name;
  }

  const [created] = await db
    .insert(bookings)
    .values({
      coupleName: input.coupleName,
      phone: input.phone,
      wechat: input.wechat,
      weddingDate: input.weddingDate,
      packageId: input.packageId,
      packageName,
      city: input.city,
      message: input.message,
    })
    .returning({ id: bookings.id });

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
