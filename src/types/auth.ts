/** Role in login response */
export interface LoginRole {
  name: string;
}

/** User in login response */
export interface LoginUser {
  id: number;
  fullName: string;
  username: string;
  roleId: number;
  role: LoginRole;
}

/** Login API response data */
export interface LoginData {
  user: LoginUser;
  accessToken: string;
  refreshToken: string;
}

/** Login API response */
export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

/** Login request payload */
export interface LoginPayload {
  username: string;
  password: string;
  loginType: string;
}
