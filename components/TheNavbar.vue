<script setup lang="ts">
import { useToast } from "vue-toastification";
import profilesApi from "~~/services/api_profiles";

const toast = useToast();
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

let userProfile = useUser();
let colorMode = useColorMode();
let darkMode = ref<boolean>(false);

const toggleMode = (): void => {
  if (colorMode.preference === "light") {
    colorMode.preference = "dark";
  } else {
    colorMode.preference = "light";
  }
};

const setUserProfile = async () => {
  const profile = await profilesApi().getCurrentUser(user.value.id);
  userProfile.value = profile;
};

let notificationsVisible = ref<boolean>(false);
let profileVisible = ref<boolean>(false);

const toggleNotifications = (): void => {
  notificationsVisible.value = !notificationsVisible.value;
};
const toggleProfile = (): void => {
  profileVisible.value = !profileVisible.value;
};

// Logout
const handleLogout = async (): Promise<void> => {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    toast("Pomyślnie wylogowano!");
    router.push("/auth");
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  colorMode.value === "dark" ? (darkMode.value = true) : (darkMode.value = false);
  if (user.value) {
    setUserProfile();
  }
});

watch(colorMode, (color) => {
  color.preference === "dark" ? (darkMode.value = true) : (darkMode.value = false);
});

watch(
  () => user?.value?.id,
  () => {
    if (user.value) setUserProfile();
  }
);
</script>

<template>
  <nav class="navbar">
    <form class="navbar__search">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" size="lg" />
      <input type="text" class="navbar__search-input" placeholder="Szukaj" />
    </form>

    <div v-tippy="`${darkMode ? 'Light Mode' : 'Dark Mode'}`" class="navbar__switch">
      <input
        @click="toggleMode()"
        v-model="darkMode"
        type="checkbox"
        id="darkmode-toggle"
        class="switch__checkbox"
      />
      <label for="darkmode-toggle" class="switch__label" />
    </div>

    <div class="navbar__buttons">
      <div v-if="user" ref="notificationsEl" class="navbar__notifications">
        <button
          @click="toggleNotifications"
          class="navbar__toggle"
          content="Powiadomienia"
          v-tippy
        >
          <font-awesome-icon icon="fa-solid fa-bell" size="xl" />
        </button>

        <!-- <span class="navbar__badge">3</span> -->
        <Transition name="scale">
          <div
            v-if="notificationsVisible"
            v-click-outside="toggleNotifications"
            class="navbar__dropdown"
          >
            <p class="info">Brak powiadomień</p>
            <!-- <div class="navbar__dropdown-item"></div> -->
          </div>
        </Transition>
      </div>

      <NuxtLink
        ref="addPinEl"
        to="/pin/add"
        class="navbar__add"
        content="Dodaj Pina"
        v-tippy
      >
        <font-awesome-icon icon="fa-solid fa-plus" size="xl" />
      </NuxtLink>

      <NuxtLink
        v-if="!user"
        ref="authEl"
        to="/auth"
        class="navbar__auth"
        content="Logowanie / Rejestracja"
        v-tippy
      >
        <font-awesome-icon icon="fa-solid fa-user" size="xl" />
      </NuxtLink>

      <!-- If logged in -->
      <div v-else @click="toggleProfile" class="navbar__profile">
        <img
          class="navbar__profile-img"
          :src="
            user?.user_metadata.avatar_to_display ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
        />
        <Transition name="scale">
          <div
            v-click-outside="toggleProfile"
            v-if="profileVisible"
            class="navbar__dropdown"
          >
            <NuxtLink
              :to="`/profile/${userProfile.profile_id}`"
              class="navbar__dropdown-item"
            >
              <font-awesome-icon
                icon="fa-solid fa-circle-user"
                size="xl"
                fixed-width
              />Przejdź do profilu
            </NuxtLink>
            <NuxtLink to="/settings" class="navbar__dropdown-item">
              <font-awesome-icon
                icon="fa-solid fa-user-gear"
                size="xl"
                fixed-width
              />Edytuj profil
            </NuxtLink>
            <button @click.prevent="handleLogout" class="navbar__dropdown-item">
              <font-awesome-icon
                icon="fa-solid fa-right-from-bracket"
                size="xl"
                fixed-width
              />Wyloguj się
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  z-index: 10;
  align-self: end;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  height: 4rem;
  padding: 0.5rem 2rem;

  @media only screen and (max-width: 50em) {
    padding: 0.5rem 1rem;
  }

  @media only screen and (max-width: 37.5em) {
    margin-right: 0.5rem;
    gap: 1rem;
  }

  &__logo {
    margin-right: auto;
    font-size: 2rem;
    color: var(--primary-color);
    font-weight: 400;
  }

  &__search {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;

    & svg {
      position: absolute;
      left: 0.75rem;
      color: var(--icon-color);
      pointer-events: none;
    }

    &-input {
      transition: all 0.2s;
      width: 100%;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      padding: 0.6rem;
      padding-left: 2.4rem;
      border-radius: 1rem;
      background-color: var(--bg-color-secondary);
      font-size: 1rem;
      color: var(--font-color);

      &:focus {
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }

  &__notifications,
  &__profile {
    position: relative;
    color: var(--font-color);
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;
  }

  &__dropdown {
    position: absolute;
    right: 0;

    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 12rem;
    margin-top: 0.25rem;
    overflow: hidden;
    border-radius: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    background-color: var(--bg-color-secondary);
    font-size: 0.9rem;
    text-align: center;

    &-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.3s;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        background-color: rgba(var(--opacity-color), 0.1);
      }

      &--center {
        text-align: center;
      }
    }

    & .info {
      padding: 0.75rem;
      font-style: italic;
      font-size: 0.9rem;
    }
  }

  &__switch {
    align-self: center;
    display: flex;
    align-items: center;
  }

  &__toggle,
  &__add,
  &__auth {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;

    background-color: var(--heading-color);
    cursor: pointer;

    & svg {
      color: var(--bg-color-secondary);

      @media only screen and (max-width: 37.5em) {
        font-size: 24px;
      }
    }

    @media only screen and (max-width: 50em) {
      width: 2.4rem;
      height: 2.4rem;
      padding: 1rem;
    }
  }

  &__profile-img {
    display: block;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;

    @media only screen and (max-width: 50em) {
      width: 2.4rem;
      height: 2.4rem;
    }
  }

  &__badge {
    position: absolute;
    top: -0.25rem;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: var(--font-color);
    font-size: 0.8rem;
    font-weight: 500;
  }

  &__auth,
  &__profile {
    @media only screen and (max-width: 50em) {
      position: fixed;
      top: 0.2rem;
      right: 1rem;
      z-index: 100;
    }

    @media only screen and (max-width: 37.5em) {
      top: 0.35rem;
    }
  }

  &__add {
    @media only screen and (max-width: 50em) {
      margin-right: 0;
    }
  }
}

.switch {
  &__checkbox {
    visibility: hidden;

    & + label {
      content: "";
      display: inline-block;
      cursor: pointer;
      height: 2rem;
      width: 2rem;
      border-radius: 50%;
      transition: all 0.3s ease-in-out;
    }

    &:not(:checked) + label {
      background-color: gold;
    }

    &:checked + label {
      box-shadow: inset -10px -6px #fff, inset -10px -6px 1px #fff;
    }
  }
}
</style>