import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Change this password to your desired password
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

export async function verifyPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth");
  return authCookie?.value === "authenticated";
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth");
}
