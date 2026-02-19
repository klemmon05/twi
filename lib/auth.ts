import { cookies } from "next/headers";

const COOKIE_NAME = "prosignal_admin";

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token && process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET;
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}

export const adminCookieName = COOKIE_NAME;
