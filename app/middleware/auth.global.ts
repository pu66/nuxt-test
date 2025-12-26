export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();
  if (auth.user == null && to.path !== "/auth/login") {
    return navigateTo("/auth/login");
  }
});
