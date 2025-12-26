import type { LoginUser } from "~/models/auth/login_res";

export function useLogin() {
  const { $api } = useNuxtApp();

  // Login with email & password
  const login = async (email: string, password: string) => {
    const response = await $api.post<LoginUser>("/auth/login", {
      email,
      password,
    });
    console.log("Login response:", response.data);

    return response.data;
  };

  return {
    login,
  };
}
