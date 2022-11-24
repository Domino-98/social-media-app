<script setup lang="ts">
import { useToast } from "vue-toastification";
import { onClickOutside } from "@vueuse/core";
import { Database } from "~~/lib/database.types";

const user = useSupabaseUser();
const client = useSupabaseClient<Database>();
const router = useRouter();
const toast = useToast();
const userProfile = useUser();
const colorMode = useColorMode();

const darkMode = ref<boolean>(false);

const toggleMode = (): void => {
  if (colorMode.preference === "light") {
    colorMode.preference = "dark";
  } else {
    colorMode.preference = "light";
  }
};

const profileVisible = ref<boolean>(false);

const toggleProfile = (): void => {
  profileVisible.value = !profileVisible.value;
};

// Logout
const handleLogout = async () => {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    const sbRefreshToken = useCookie("sb-refresh-token");
    sbRefreshToken.value = null;
    const sbAccessToken = useCookie("sb-access-token");
    sbAccessToken.value = null;
    userProfile.value = null;
    await client.removeAllChannels();
    toast("Pomyślnie wylogowano!");
    window.location.href = "/auth";
  } catch (error) {
    console.error(error);
  }
};

const searchValue = ref<string>("");

const searchPins = async (searchValue: string) => {
  router.push({
    path: "/",
    query: { search: searchValue },
  });
};

const profileEl = ref();

onClickOutside(profileEl, (e: Event) => {
  if ((e.target as HTMLElement).id !== "profileBtn") toggleProfile();
});

watch(colorMode, (color) => {
  color.preference === "dark"
    ? (darkMode.value = true)
    : (darkMode.value = false);
});

onMounted(async () => {
  colorMode.value === "dark"
    ? (darkMode.value = true)
    : (darkMode.value = false);
});
</script>

<template>
  <nav class="navbar">
    <form @submit.prevent="searchPins(searchValue)" class="navbar__search">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" size="lg" />
      <input
        v-model="searchValue"
        type="text"
        class="navbar__search-input"
        placeholder="Szukaj"
      />
    </form>

    <div
      v-tippy="`${darkMode ? 'Light Mode' : 'Dark Mode'}`"
      class="navbar__switch"
    >
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
      <NotificationButton v-show="user" ref="notificationsEl" />

      <ChatButton v-show="user" />

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
        v-show="!user"
        ref="authEl"
        to="/auth"
        class="navbar__auth"
        content="Logowanie / Rejestracja"
        v-tippy
      >
        <font-awesome-icon icon="fa-solid fa-user" size="xl" />
      </NuxtLink>

      <!-- If logged in -->
      <div
        v-show="user"
        @click="toggleProfile"
        class="navbar__profile"
        id="profileBtn"
      >
        <img
          class="navbar__profile-img"
          :src="
            user?.user_metadata.avatar_to_display ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
        />
        <Transition name="scale">
          <div
            ref="profileEl"
            v-if="profileVisible"
            class="profile__dropdown"
            id="profileBtn"
          >
            <NuxtLink
              :to="`/profile/${userProfile?.profile_id}`"
              class="profile__dropdown-item"
            >
              <font-awesome-icon
                icon="fa-solid fa-circle-user"
                size="xl"
                class="icon"
                fixed-width
              />Przejdź do profilu
            </NuxtLink>
            <NuxtLink to="/settings" class="profile__dropdown-item">
              <font-awesome-icon
                icon="fa-solid fa-user-gear"
                size="xl"
                class="icon"
                fixed-width
              />Edytuj profil
            </NuxtLink>
            <button
              @click.prevent="handleLogout"
              class="profile__dropdown-item"
            >
              <font-awesome-icon
                icon="fa-solid fa-right-from-bracket"
                size="xl"
                class="icon"
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
    gap: 0.5rem;
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
      box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
        rgba(17, 17, 26, 0.1) 0px 0px 6px;
      padding: 0.6rem;
      padding-left: 2.4rem;
      border-radius: 2rem;
      background-color: var(--bg-color-secondary);
      font-size: 1rem;
      color: var(--font-color);

      &:focus {
        box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
          rgba(17, 17, 26, 0.15) 0px 0px 8px;
      }
    }
  }

  &__profile {
    position: relative;
    color: var(--font-color);
    cursor: pointer;
    user-select: none;
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;
  }

  &__switch {
    align-self: center;
    display: flex;
    align-items: center;
  }

  &__profile-img {
    display: block;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    pointer-events: none;

    @media only screen and (max-width: 50em) {
      width: 2.4rem;
      height: 2.4rem;
    }
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

:deep() {
  .navbar,
  .notifications {
    &__toggle,
    &__add,
    &__chats,
    &__auth {
      position: relative;
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
  }

  .badge {
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
    color: #fff;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .notifications,
  .profile {
    &__dropdown {
      position: absolute;
      right: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      width: 12rem;
      margin-top: 0.25rem;
      overflow: hidden;
      border-radius: 0.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      background-color: var(--bg-color-secondary);
      font-size: 0.9rem;
      text-align: center;

      & .icon {
        color: var(--icon-color);
      }

      &-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        transition: all 0.3s;
        padding: 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        cursor: pointer;

        &:hover {
          background-color: rgba(var(--opacity-color), 0.1);
        }

        &--center {
          text-align: center;
        }
      }
    }
  }

  .notifications {
    &__dropdown {
      width: 17.5rem;

      @media only screen and (max-width: 25em) {
        right: -5.8rem;
      }
    }
  }
}
</style>
