import { BaseApiService } from "@/lib/base-api.service";
import type {
  Employee,
  GetEmployeesParams,
  GetEmployeesResponse,
  GetEmployeesApiResponse,
} from "@/types/employee";

export class EmployeeService extends BaseApiService {
  protected readonly basePath = "/api/employees";

  async getEmployees(params: GetEmployeesParams): Promise<GetEmployeesResponse> {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search } = params;
    const body = await this.get<GetEmployeesApiResponse>("", {
      page,
      limit,
      sortBy,
      sortOrder,
      ...(search?.trim() ? { search: search.trim() } : {}),
    });
    if (!body.success || !body.data) {
      throw new Error(body.message ?? "Failed to fetch employees");
    }
    const { data, total, page: p, limit: l } = body.data;
    return { data, total, page: p, limit: l };
  }

  /** Get single employee by id*/
  async getEmployee(id: number): Promise<Employee | null> {
    try {
      return await this.get<Employee>(`/${id}`);
    } catch {
      return null;
    }
  }
}

export const employeeService = new EmployeeService();

export const getEmployees = (params: GetEmployeesParams) =>
  employeeService.getEmployees(params);
