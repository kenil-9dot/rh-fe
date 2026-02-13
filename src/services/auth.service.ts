import { isAxiosError } from "axios";
import { api } from "@/lib/axios";
import type { LoginPayload, LoginApiResponse } from "@/types/auth";

export async function loginUser(
  payload: LoginPayload
): Promise<LoginApiResponse> {
  try {
    const response = await api.post<LoginApiResponse>("/api/auth/login", payload);
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.data && typeof err.response.data === "object" && "message" in err.response.data) {
      const message = String((err.response.data as { message?: unknown }).message);
      if (message) throw new Error(message);
    }
    throw err;
  }
}
