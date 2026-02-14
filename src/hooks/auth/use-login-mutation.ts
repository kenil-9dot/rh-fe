import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { createSession } from "@/actions/session";
import type { LoginPayload, LoginApiResponse } from "@/types/auth";

export type UseLoginMutationOptions = Omit<
  UseMutationOptions<LoginApiResponse, Error, LoginPayload>,
  "mutationFn"
>;

/**
 * Login mutation: calls auth API, stores token and session, redirects on success.
 * Handle onError in the component for custom error messages.
 */
export function useLoginMutation(options?: UseLoginMutationOptions) {
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: async (data, variables, context, mutation) => {
      await options?.onSuccess?.(data, variables, context, mutation);
      if (data.success && data.data) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("access_token", data.data.accessToken);
          window.localStorage.setItem("user_id", String(data.data.user.id));
        }
        await createSession(data.data.accessToken);
        router.push("/");
      }
    },
  });
}
