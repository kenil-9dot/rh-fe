import type { GetEmployeesParams } from "@/types/employee";

/**
 * Centralized query key factory for TanStack Query.
 * Use these keys in hooks and invalidate them after mutations.
 */
export const queryKeys = {
  employees: {
    all: ["employees"] as const,
    lists: () => [...queryKeys.employees.all, "list"] as const,
    list: (params: GetEmployeesParams) =>
      [...queryKeys.employees.lists(), params] as const,
    details: () => [...queryKeys.employees.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.employees.details(), id] as const,
  },
  auth: {
    user: ["auth", "user"] as const,
    session: ["auth", "session"] as const,
  },
} as const;
