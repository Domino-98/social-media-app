import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";

const toast = useToast();

export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    if (to.path === "/pin/add" && process.client) {
      toast("Musisz się zalogować, by móc dodać pina!", {
        type: TYPE.ERROR,
      });
    }
    return navigateTo("/auth");
  }
});
