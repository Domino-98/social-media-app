<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { Database } from "~~/lib/database.types";

const client = useSupabaseClient<Database>();
const router = useRouter();
const toast = useToast();

const registerSchema = yup.object({
  username: yup
    .string()
    .required("Nazwa użytkownika jest wymagana")
    .min(3, "Minimalna ilość znaków: 3")
    .max(20, "Maksymalna ilość znaków: 20"),
  email: yup
    .string()
    .required("Adres email jest wymagany")
    .email("Adres email musi być prawidłowy"),
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

const handleRegister = async (
  values: any,
  { resetForm }: { resetForm: Function }
): Promise<void> => {
  isLoading.value = true;
  const { email, password, username } = values;
  try {
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      toast(error.message, {
        type: TYPE.ERROR,
      });
      throw error;
    }

    toast("Potwierdź swój adres email, aby aktywować konto!", {
      type: TYPE.INFO,
      timeout: 5000,
    });
    resetForm();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const providerLogin = async (provider: "google" | "facebook") => {
  try {
    const { error } = await client.auth.signInWithOAuth({ provider });

    if (error) {
      toast(error.message, {
        type: TYPE.ERROR,
      });
      throw error;
    }

    router.push("/");
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};

const passVisible = ref<boolean>(false);
const passConfirmVisible = ref<boolean>(false);
</script>

<template>
  <div>
    <h1 class="auth__header">Zarejestruj się</h1>

    <VForm
      @submit="handleRegister"
      :validation-schema="registerSchema"
      class="auth__form"
    >
      <div class="auth__form-group">
        <VField
          name="username"
          type="text"
          id="username"
          class="auth__form-input"
          placeholder=" "
        />
        <font-awesome-icon icon="fa-solid fa-user" class="icon" />
        <label for="username" class="auth__form-label">Nazwa użytkownika</label>
        <VErrorMessage name="username" class="error" />
      </div>
      <div class="auth__form-group">
        <VField
          name="email"
          type="email"
          id="email"
          class="auth__form-input"
          placeholder=" "
        />
        <font-awesome-icon icon="fa-solid fa-envelope" class="icon" />
        <label for="email" class="auth__form-label">Email</label>
        <VErrorMessage name="email" class="error" />
      </div>
      <div class="auth__form-group">
        <VField
          ref="pass"
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
          ref="pass2"
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
        <label for="password2" class="auth__form-label">Powtórz hasło</label>
        <VErrorMessage name="passwordConfirmation" class="error" />
      </div>
      <button :disabled="isLoading" class="auth__form-btn">
        {{ isLoading ? "Trwa rejestracja..." : "Zarejestruj się" }}
      </button>
    </VForm>
    <p class="auth__providers-text">Lub zarejestruj się za pomocą</p>
    <div class="auth__providers">
      <svg
        @click.prevent="providerLogin('google')"
        class="auth__providers-google"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 32 32"
        width="40"
        height="40"
      >
        <path
          fill="#fff"
          d="M 16.003906 14.0625 L 16.003906 18.265625 L 21.992188 18.265625 C 21.210938 20.8125 19.082031 22.636719 16.003906 22.636719 C 12.339844 22.636719 9.367188 19.664063 9.367188 16 C 9.367188 12.335938 12.335938 9.363281 16.003906 9.363281 C 17.652344 9.363281 19.15625 9.96875 20.316406 10.964844 L 23.410156 7.867188 C 21.457031 6.085938 18.855469 5 16.003906 5 C 9.925781 5 5 9.925781 5 16 C 5 22.074219 9.925781 27 16.003906 27 C 25.238281 27 27.277344 18.363281 26.371094 14.078125 Z"
        ></path>
      </svg>
      <svg
        @click.prevent="providerLogin('facebook')"
        class="auth__providers-facebook"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        viewBox="0 0 24 24"
        width="40"
        height="40"
      >
        <path
          fill="#fff"
          d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z"
        />
      </svg>
    </div>
    <div class="auth__signup">
      <p class="auth__signup-text">Masz już konto?</p>
      <a @click="$emit('auth-state', 'login')" class="auth__signup-switch"
        >Zaloguj się</a
      >
    </div>
  </div>
</template>
