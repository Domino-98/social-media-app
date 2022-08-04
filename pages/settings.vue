<script setup lang="ts">
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { User } from "~~/models/user";

const toast = useToast();
const client = useSupabaseClient();

const firstName = ref<string>("");
const lastName = ref<string>("");
const fullName = computed((): string => firstName.value + " " + lastName.value);

const userInfo = reactive<User>({
  avatar_url: "",
  full_name: fullName.value,
  username: "",
  bio: "",
  website: "",
  background_url: "",
});

const validWebsite = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const regex = new RegExp(validWebsite);

const getUserInfo = async () => {
  const { data: profile, error } = await client
    .from("profiles")
    .select()
    .match({ id: client.auth.user().id })
    .single();

  if (error) throw error;

  const {
    avatar_url,
    full_name,
    username,
    bio,
    website,
    background_url,
    profile_id,
    email,
  } = profile;

  userInfo.avatar_url = avatar_url;
  firstName.value = full_name?.split(" ")[0];
  lastName.value = full_name?.split(" ")[1];
  userInfo.username = username || `${email.split("@")[0]}#${profile_id}`;
  userInfo.bio = bio;
  userInfo.website = website;
  userInfo.background_url = background_url;
};

let isLoading = ref(false);

const updateUserInfo = async () => {
  userInfo.full_name = fullName.value;
  isLoading.value = true;
  try {
    console.log(client.auth.user().id);

    if (userInfo.website && !userInfo.website.match(regex))
      return toast("Nieprawidłowy adres strony", { type: TYPE.ERROR });

    const { error: updateError } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        ...userInfo,
      })
      .match({ id: client.auth.user().id });

    if (updateError) {
      let message = updateError.message;

      if (updateError.code === "23505") {
        message = "Podana nazwa użytkownika jest już zajęta";
      } else if (updateError.code === "23514") {
        message = "Nazwa użytkownika musi zawierać minimum 3 znaki";
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
    isLoading.value = false;
  }
};

onMounted(() => {
  getUserInfo();
});

definePageMeta({
  layout: "navigation",
  middleware: "auth",
});
</script>

<template>
  <main>
    <div class="settings">
      <h1 class="settings__header">Edycja profilu</h1>
      <form class="settings__form">
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Tło</label>
          <SettingsBackground
            :background-url="userInfo.background_url"
            @update-background="(publicUrl) => (userInfo.background_url = publicUrl)"
          />
        </div>
        <div class="settings__form-group">
          <label class="settings__form-label">Awatar</label>
          <SettingsAvatar
            :avatar-url="userInfo.avatar_url"
            @update-avatar="(publicUrl) => (userInfo.avatar_url = publicUrl)"
          />
        </div>
        <div class="settings__form-name">
          <div class="settings__form-group">
            <label for="first-name" class="settings__form-label">Imię</label>
            <input
              v-model="firstName"
              type="text"
              id="first-name"
              class="settings__form-input"
            />
          </div>
          <div class="settings__form-group">
            <label for="last-name" class="settings__form-label">Nazwisko</label>
            <input
              v-model="lastName"
              type="text"
              id="last-name"
              class="settings__form-input"
            />
          </div>
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">O mnie</label>
          <textarea
            v-model="userInfo.bio"
            class="settings__form-input"
            id=""
            cols="20"
            rows="3"
            placeholder="Opowiedz coś o sobie"
          ></textarea>
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Nazwa użytkownika</label>
          <input v-model="userInfo.username" type="text" class="settings__form-input" />
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Witryna / Portfolio</label>
          <input
            v-model="userInfo.website"
            type="text"
            class="settings__form-input"
            placeholder="https://"
          />
        </div>
        <button
          :disabled="isLoading"
          type="submit"
          @click.prevent="updateUserInfo"
          class="settings__save-btn"
        >
          <span v-show="isLoading" class="loading-spinner"></span>
          <span>{{ isLoading ? "Zapisywanie" : "Zapisz" }}</span>
        </button>
      </form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
}

:deep() {
  .settings {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 30rem;
    margin-top: 0.5rem;
    padding: 1.5rem;
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

      &-name {
        display: flex;
      }

      &-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0 0.5rem;
        margin-top: 1rem;
      }

      &-label {
        font-size: 0.9rem;
        color: var(--font-color);
      }

      &-input {
        transition: all 0.3s;
        width: 100%;
        padding: 0.5rem;
        border-radius: 1rem;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        background-color: var(--bg-color-primary);
        color: var(--font-color);

        &:focus {
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        }
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

:deep(.loading-spinner) {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
</style>
