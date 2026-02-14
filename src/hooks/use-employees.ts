import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { employeeService } from "@/services/employee.service";
import type {
  Employee,
  GetEmployeesParams,
  GetEmployeesResponse,
  CreateEmployeePayload,
} from "@/types/employee";

export const defaultEmployeesParams: GetEmployeesParams = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export type UseEmployeesParams = GetEmployeesParams;

export type UseEmployeesOptions = Omit<
  UseQueryOptions<
    GetEmployeesResponse,
    Error,
    GetEmployeesResponse,
    ReturnType<typeof queryKeys.employees.list>
  >,
  "queryKey" | "queryFn"
>;

export type UseEmployeeOptions = Omit<
  UseQueryOptions<
    Employee | null,
    Error,
    Employee | null,
    ReturnType<typeof queryKeys.employees.detail>
  >,
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

/**
 * Fetch a single employee by id.
 */
export function useEmployee(id: number | null, options?: UseEmployeeOptions) {
  return useQuery({
    queryKey: queryKeys.employees.detail(id ?? 0),
    queryFn: () =>
      id != null ? employeeService.getEmployee(id) : Promise.resolve(null),
    enabled: id != null && id > 0,
    ...options,
  });
}

export type UseCreateEmployeeOptions = UseMutationOptions<
  Employee,
  Error,
  CreateEmployeePayload
>;

/**
 * Create a new employee. Invalidates and refetches employees list on success.
 */
export function useCreateEmployee(options?: UseCreateEmployeeOptions) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      employeeService.createEmployee(payload),
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      await queryClient.refetchQueries({ queryKey: queryKeys.employees.lists() });
      await userOnSuccess?.(data, variables, context, mutation);
    },
    ...restOptions,
  });
}
