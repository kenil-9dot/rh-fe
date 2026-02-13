import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEmployees } from "@/services/employee.service";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc";

  try {
    const result = await getEmployees(
      { page, limit, sortBy, sortOrder },
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/employees error:", err);
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Failed to fetch employees";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
