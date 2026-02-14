/** Department from API */
export interface EmployeeDepartment {
  id: number;
  name: string;
}

/** User linked to employee from API */
export interface EmployeeUser {
  id: number;
  username: string;
  fullName: string;
}

/** Single employee from API (raw shape) */
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  userId: number;
  departmentId: number;
  photoUrl: string | null;
  gender: number;
  dob: string | null;
  maritalStatus: number;
  idPhotoUrl: string | null;
  personalPhone: string | null;
  workPhone: string | null;
  personalEmail: string | null;
  workEmail: string | null;
  address: string;
  status: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  department: EmployeeDepartment;
  user: EmployeeUser;
}

/** Query params for GET /api/employees */
export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

/** Inner data payload from API */
export interface GetEmployeesData {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}

/** Full API response for GET /api/employees */
export interface GetEmployeesApiResponse {
  success: boolean;
  message: string;
  data: GetEmployeesData;
}

/** API response for GET /api/employees/:id */
export interface GetEmployeeApiResponse {
  success: boolean;
  message?: string;
  data: Employee;
}

/** Normalized shape for UI (after unwrapping) */
export interface GetEmployeesResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}

/** Payload for POST /api/employees (create employee) */
export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  userId: number;
  departmentId: number;
  address: string;
  photoUrl?: string | null;
  gender?: number;
  dob?: string | null;
  maritalStatus?: number;
  idPhotoUrl?: string | null;
  personalPhone?: string | null;
  workPhone?: string | null;
  personalEmail?: string | null;
  workEmail?: string | null;
  status?: number;
}
