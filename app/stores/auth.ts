import { defineStore } from "pinia";
import type { LoginUser } from "~/models/auth/login_res";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as LoginUser | null,
  }),
  actions: {
    setUser(user: LoginUser) {
      this.user = user;
    },
    logout() {
      this.user = null;
    },
  },
  persist: true,
});
