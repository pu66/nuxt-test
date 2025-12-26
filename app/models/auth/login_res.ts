// export interface LoginUser {
//   token: string | null | undefined;
//   id: number;
//   fullname: string;
//   email: string;
//   role: string;
//   type: string;
// }

// export interface LoginResponse {
//   success: boolean;
//   user: LoginUser;
//   token: string;
// }
export interface LoginUser {
  token: string | null | undefined;
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
