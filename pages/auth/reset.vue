<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import queryString from "query-string";

const toast = useToast();

const client = useSupabaseClient();
const router = useRouter();
const route = useRoute();

const access_token = queryString.parse(route.fullPath.split("#")[1])
  .access_token as string;

const passSchema = yup.object({
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Minimalna ilość znaków: 8"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Hasła muszą do siebie pasować"),
});

// Reset password
const handleReset = async (values): Promise<void> => {
  try {
    const { error, data } = await client.auth.api.updateUser(access_token, {
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
    console.error(error.message);
  }
};

let passVisible = ref<boolean>(false);
let passConfirmVisible = ref<boolean>(false);
</script>

<template>
  <main class="auth-container">
    <video id="background-video" autoplay loop muted>
      <source src="~/assets/background.mp4" type="video/mp4" />
    </video>
    <NuxtLink to="/" class="logo">
      <span class="material-icons-outlined md-42">camera</span>
      <h1 class="logo-text">We<span>Share</span></h1>
    </NuxtLink>
    <div class="auth">
      <div>
        <h1 class="auth__header">Resetowanie hasła</h1>

        <VForm :validation-schema="passSchema" @submit="handleReset" class="auth__form">
          <div class="auth__form-group">
            <VField
              name="password"
              :type="passVisible ? 'text' : 'password'"
              id="password"
              class="auth__form-input"
              placeholder=" "
            />
            <span class="material-icons-outlined md-18 icon">lock</span>
            <span
              @click="passVisible = !passVisible"
              class="material-icons-outlined md-18 icon icon--visibility"
              >{{ passVisible ? "visibility" : "visibility_off" }}</span
            >
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
            <span class="material-icons-outlined md-18 icon">lock</span>
            <span
              @click="passConfirmVisible = !passConfirmVisible"
              class="material-icons-outlined md-18 icon icon--visibility"
              >{{ passConfirmVisible ? "visibility" : "visibility_off" }}</span
            >
            <label for="password2" class="auth__form-label">Powtórz hasło</label>
            <VErrorMessage name="passwordConfirmation" class="error" />
          </div>

          <button class="auth__form-btn">Zmień hasło</button>
        </VForm>
        <div class="auth__signup">
          <NuxtLink to="/" class="auth__signup-switch">Strona główna</NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
