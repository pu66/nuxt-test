import type { LoginResponse, LoginUser } from "~/models/auth/login_res";

export function useLogin() {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie("token");

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await $api.post<LoginUser>("/auth/login", {
        email,
        password,
      });

      if (response.data?.token) {
        tokenCookie.value = response.data.token;
        await navigateTo("/", { replace: true });
      }

      return {
        success: true,
        user: response.data,
        token: response.data.token ?? "",
      };
    } catch (error) {
      return {
        success: false,
        user: {} as LoginUser,
        token: "",
      };
    }
  };

  const googleLogin = async (credential: string): Promise<LoginResponse> => {
    try {
      const response = await $api.post<LoginUser>("/auth/google-login", {
        token: credential,
      });

      if (response.data?.token) {
        tokenCookie.value = response.data.token;
        await navigateTo("/payment/checkSlipOk", { replace: true });
      }

      return {
        success: true,
        user: response.data,
        token: response.data.token ?? "",
      };
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        user: {} as LoginUser,
        token: "",
      };
    }
  };
  const logout = () => {
    tokenCookie.value = null;

    navigateTo("/auth/login");
  };
  return {
    login,
    googleLogin,
    logout,
  };
}
