<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { Database } from "~~/lib/database.types";

const client = useSupabaseClient<Database>();
const router = useRouter();
const toast = useToast();

const passSchema = yup.object({
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Minimalna ilość znaków: 8"),
  passwordConfirmation: yup
    .string()
    .required("Powtórz hasło")
    .oneOf([yup.ref("password"), null], "Hasła muszą do siebie pasować"),
});

const isLoading = ref<boolean>(false);

const handleReset = async (values: any): Promise<void> => {
  isLoading.value = true;
  try {
    const { error, data } = await client.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast(error.message, {
        type: TYPE.ERROR,
      });
      throw error;
    }

    toast("Hasło zostało zmienione!");
    router.push("/");
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const passVisible = ref<boolean>(false);
const passConfirmVisible = ref<boolean>(false);
</script>

<template>
  <main class="auth-container">
    <video id="background-video" autoplay loop muted>
      <source src="~/assets/background.mp4" type="video/mp4" />
    </video>
    <NuxtLink to="/" class="logo">
      <img class="logo__icon" src="~/assets/icons/camera.svg" alt="logo" />
      <h1 class="logo__text">We<span>Share</span></h1>
    </NuxtLink>
    <div class="auth">
      <div>
        <h1 class="auth__header">Resetowanie hasła</h1>
        <VForm
          :validation-schema="passSchema"
          @submit="handleReset"
          class="auth__form"
        >
          <div class="auth__form-group">
            <VField
              name="password"
              :type="passVisible ? 'text' : 'password'"
              id="password"
              class="auth__form-input"
              placeholder=" "
            />
            <font-awesome-icon icon="fa-solid fa-lock" class="icon" />
            <font-awesome-icon
              @click="passVisible = !passVisible"
              :icon="`fa-solid fa-eye${!passVisible ? '-slash' : ''}`"
              class="icon icon--visibility"
            />
            <label for="password" class="auth__form-label">Hasło</label>
            <VErrorMessage name="password" class="error" />
          </div>
          <div class="auth__form-group">
            <VField
              name="passwordConfirmation"
              :type="passConfirmVisible ? 'text' : 'password'"
              id="password2"
              class="auth__form-input"
              placeholder=" "
            />
            <font-awesome-icon icon="fa-solid fa-lock" class="icon" />
            <font-awesome-icon
              @click="passConfirmVisible = !passConfirmVisible"
              :icon="`fa-solid fa-eye${!passConfirmVisible ? '-slash' : ''}`"
              class="icon icon--visibility"
            />
            <label for="password2" class="auth__form-label"
              >Powtórz hasło
            </label>
            <VErrorMessage name="passwordConfirmation" class="error" />
          </div>

          <button type="submit" :disabled="isLoading" class="auth__form-btn">
            {{ isLoading ? "Zmienianie hasła..." : "Zmień hasło" }}
          </button>
        </VForm>
        <div class="auth__signup">
          <NuxtLink to="/" class="auth__signup-switch">Strona główna</NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
