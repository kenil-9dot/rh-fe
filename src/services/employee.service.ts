import { BaseApiService } from "@/lib/base-api.service";
import type {
  Employee,
  GetEmployeesParams,
  GetEmployeesResponse,
  GetEmployeesApiResponse,
  GetEmployeeApiResponse,
  CreateEmployeePayload,
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

  /** Create a new employee */
  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const body = await this.post<{ success: boolean; data?: Employee; message?: string }>("", {
      firstName: payload.firstName,
      lastName: payload.lastName,
      userId: payload.userId,
      departmentId: payload.departmentId,
      address: payload.address,
      photoUrl: payload.photoUrl ?? null,
      gender: payload.gender ?? 1,
      dob: payload.dob ? new Date(payload.dob) : null,
      maritalStatus: payload.maritalStatus ?? 1,
      idPhotoUrl: payload.idPhotoUrl ?? null,
      personalPhone: payload.personalPhone ?? null,
      workPhone: payload.workPhone ?? null,
      personalEmail: payload.personalEmail ?? null,
      workEmail: payload.workEmail ?? null,
      status: payload.status ?? 1,
    });
    if (!body || (typeof body === "object" && "success" in body && !(body as { success: boolean }).success)) {
      const msg = body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : "Failed to create employee";
      throw new Error(msg);
    }
    const data = body && typeof body === "object" && "data" in body ? (body as { data: Employee }).data : null;
    if (!data) throw new Error("No employee data returned");
    return data;
  }

  /** Get single employee by id */
  async getEmployee(id: number): Promise<Employee | null> {
    try {
      const body = await this.get<GetEmployeeApiResponse | Employee>(`/${id}`);
      if (body && typeof body === "object" && "success" in body && "data" in body) {
        return (body as GetEmployeeApiResponse).success ? (body as GetEmployeeApiResponse).data : null;
      }
      return body as Employee;
    } catch {
      return null;
    }
  }
}

export const employeeService = new EmployeeService();

export const getEmployees = (params: GetEmployeesParams) =>
  employeeService.getEmployees(params);
