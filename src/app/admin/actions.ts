"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, bookingStatuses, type BookingStatus } from "@/db/schema";
import {
  endAdminSession,
  hasAdminSession,
  startAdminSession,
  verifyAdminPassword,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    redirect("/admin?error=1");
  }

  await startAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin");
}

export async function updateBookingStatusAction(formData: FormData) {
  if (!(await hasAdminSession())) {
    redirect("/admin");
  }

  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  if (!Number.isInteger(id) || !(bookingStatuses as readonly string[]).includes(status)) {
    return;
  }

  await db
    .update(bookings)
    .set({ status: status as BookingStatus })
    .where(eq(bookings.id, id));

  revalidatePath("/admin");
}
