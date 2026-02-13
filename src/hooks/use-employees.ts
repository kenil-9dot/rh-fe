import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { employeeService } from "@/services/employee.service";
import type { GetEmployeesParams, GetEmployeesResponse } from "@/types/employee";

export const defaultEmployeesParams: GetEmployeesParams = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export type UseEmployeesParams = GetEmployeesParams;

export type UseEmployeesOptions = Omit<
  UseQueryOptions<GetEmployeesResponse, Error, GetEmployeesResponse, ReturnType<typeof queryKeys.employees.list>>,
  "queryKey" | "queryFn"
>;

/**
 * Fetch paginated employees. Uses TanStack Query with shared query keys.
 */
export function useEmployees(
  params: UseEmployeesParams = defaultEmployeesParams,
  options?: UseEmployeesOptions
) {
  return useQuery({
    queryKey: queryKeys.employees.list(params),
    queryFn: () => employeeService.getEmployees(params),
    ...options,
  });
}
