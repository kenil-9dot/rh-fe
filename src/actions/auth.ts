"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import axios from "axios";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export async function login(formData: FormData) {
  const username = formData.get("username")?.toString()?.trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      username,
      password,
      loginType: "admin",
    });
    if (!res.data.success) {
      return { error: res.data.message ?? "Failed to login" };
    }
    const { accessToken, refreshToken } = res.data.data;
    const cookieStore = await cookies();

    cookieStore.set("session_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    // Optional: store refresh token for token refresh flow
    if (refreshToken) {
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    redirect("/");
  } catch (err) {
    const message =
      err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message
        : null;
    return {
      error: message ?? (err instanceof Error ? err.message : "Invalid username or password"),
    };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  cookieStore.delete("refresh_token");
  redirect("/login");
}
