"use server";

import { cookies } from "next/headers";
import { getEmployees as getEmployeesService } from "@/services/employee.service";
import type { GetEmployeesResponse } from "@/types/employee";

export async function getEmployeesAction(params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}): Promise<GetEmployeesResponse | { error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    const result = await getEmployeesService(params);
    return result;
  } catch (err) {
    console.error("getEmployeesAction error:", err);
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Failed to fetch employees";
    return { error: message };
  }
}
