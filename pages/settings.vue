<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import profilesApi from "~~/services/api_profiles";

const toast = useToast();
const user = useSupabaseUser();
const userProfile = useUser();

const firstName = ref<string>(
  userProfile.value?.full_name?.split(" ")[0]
    ? userProfile.value?.full_name?.split(" ")[0]
    : ""
);
const lastName = ref<string>(
  userProfile.value?.full_name?.split(" ")[1]
    ? userProfile.value?.full_name?.split(" ")[1]
    : ""
);
const fullName = computed(() => firstName.value + " " + lastName.value);

const isProfileLoaded = computed(() =>
  Object.values(userProfile.value!).some((value) => value)
);

const validURL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const regex = new RegExp(validURL);

const userSchema = yup.object({
  username: yup
    .string()
    .required("Nazwa użytkownika jest wymagana")
    .min(3, "Nazwa użytkownika musi zawierać minimum 3 znaki"),
  website: yup.lazy((value) =>
    !value
      ? yup.string()
      : yup.string().matches(validURL, "Adres URL jest nieprawidłowy")
  ),
});

const updateLoading = ref(false);

const updateUserInfo = async (values: any) => {
  updateLoading.value = true;
  try {
    if (userProfile.value?.website && !userProfile.value?.website.match(regex))
      return toast("Nieprawidłowy adres strony", { type: TYPE.ERROR });

    const updateError = await profilesApi().updateUser(user.value!.id, {
      ...userProfile.value,
      full_name: fullName.value,
    });

    if (updateError) {
      let message = updateError.message;

      if (updateError.code === "23505") {
        message = "Podana nazwa użytkownika jest już zajęta";
      }

      toast(message, {
        type: TYPE.ERROR,
      });
      throw updateError;
    }

    toast("Pomyślnie zaktualizowano profil!");
  } catch (error) {
    console.error(error);
  } finally {
    updateLoading.value = false;
  }
};

watch(
  () => userProfile.value?.full_name,
  (newValue) => {
    firstName.value = newValue?.split(" ")[0] as string;
    lastName.value = newValue?.split(" ")[1] as string;
  },
  { deep: true }
);

definePageMeta({
  layout: "navigation",
  middleware: "auth",
});
</script>

<template>
  <main>
    <div v-if="isProfileLoaded" class="settings">
      <h1 class="settings__header">Edycja profilu</h1>
      <VForm
        @submit="updateUserInfo"
        :validation-schema="userSchema"
        class="settings__form"
      >
        <SettingsBackground
          label="Tło"
          :background-url="userProfile?.background_url!"
          @update-background="(publicUrl: string) => (userProfile!.background_url = publicUrl)"
        />
        <SettingsAvatar
          label="Awatar"
          :avatar-url="userProfile?.avatar_url!"
          @update-avatar="(publicUrl: string) => (userProfile!.avatar_url = publicUrl)"
        />
        <div class="settings__form-wrapper">
          <BaseInput
            v-model="firstName"
            name="firstName"
            label="Imię"
            id="firstName"
            type="text"
          />
          <BaseInput
            v-model="lastName"
            name="lastName"
            label="Nazwisko"
            id="lastName"
            type="text"
          />
        </div>
        <BaseTextarea
          v-model="userProfile!.bio"
          name="bio"
          label="O mnie"
          id="bio"
          placeholder="O mnie"
        />
        <BaseInput
          v-model="userProfile!.username"
          name="username"
          label="Nazwa użytkownika"
          id="username"
          type="text"
        />
        <BaseInput
          v-model="userProfile!.website"
          name="website"
          label="Witryna / Portfolio"
          id="website"
          type="text"
          placeholder="https://"
        />
        <button
          :disabled="updateLoading"
          type="submit"
          class="settings__save-btn"
        >
          <span
            v-show="updateLoading"
            class="loading-spinner loading-spinner--sm loading-spinner--light"
          ></span>
          <span>{{ updateLoading ? "Zapisywanie" : "Zapisz" }}</span>
        </button>
      </VForm>
    </div>
    <span v-if="!isProfileLoaded" class="loading-spinner"></span>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
  margin-top: 0.5rem;
}

.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 30rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--bg-color-secondary);

  @media only screen and (max-width: 37.5em) {
    padding: 1rem;
  }

  &__header {
    font-size: 1.6rem;
    font-weight: 500;
    font-family: "Rubik", "sans-serif";
    color: var(--heading-color);
  }

  &__form {
    align-self: start;
    width: 100%;

    &-wrapper {
      display: flex;
      gap: 1.25rem;
    }
  }

  &__save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-top: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 2rem;
    cursor: pointer;
    background-color: var(--primary-color);
    color: #fff;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }
}

:deep(input[type="file"]) {
  display: none;
}

:deep(input:disabled + .upload),
:deep(button:disabled) {
  cursor: not-allowed;
  filter: grayscale(50%);
}

:deep(.upload) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: var(--btn-bg);
  color: #fff;
  border-radius: 2rem;
  border-radius: 2rem;
  cursor: pointer;

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
  }
}
</style>
