export interface LoginUser {
  id: number;
  fullname: string;
  email: string;
  role: string;
  type: string;
}

export interface LoginResponse {
  success: boolean;
  user: LoginUser;
  token: string;
}
