import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/** Returns the session token so the client can call the backend (e.g. localhost:5000) directly. */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ token });
}
