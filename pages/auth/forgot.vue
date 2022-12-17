<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { Database } from "~~/lib/database.types";

const client = useSupabaseClient<Database>();
const toast = useToast();

const emailRules = yup
  .string()
  .required("Adres email jest wymagany")
  .email("Adres email musi być prawidłowy");

const isLoading = ref<boolean>(false);

// Send link for password reset
const handleReset = async (values: any): Promise<void> => {
  isLoading.value = true;
  try {
    const { data, error } = await client.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/reset/`,
    });

    if (error) {
      toast(error.message, {
        type: TYPE.ERROR,
      });
      throw error;
    }

    toast("Na podany adres email został wysłany link z instrukcją", {
      type: TYPE.INFO,
      timeout: 10000,
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div>
    <h1 class="auth__header">Przypomnij hasło</h1>
    <VForm @submit="handleReset" class="auth__form">
      <div class="auth__form-group">
        <VField
          :rules="emailRules"
          name="email"
          type="email"
          id="email"
          class="auth__form-input"
          placeholder=" "
        />
        <font-awesome-icon icon="fa-solid fa-envelope" class="icon" />
        <label for="email" class="auth__form-label">Adres email</label>
        <VErrorMessage name="email" class="error" />
      </div>

      <button :disabled="isLoading" class="auth__form-btn">
        {{ isLoading ? "Wysyłanie linku..." : "Przypomnij hasło" }}
      </button>
    </VForm>
    <div class="auth__signup">
      <NuxtLink to="/auth/login" class="auth__signup-switch">Logowanie</NuxtLink>
    </div>
  </div>
</template>
