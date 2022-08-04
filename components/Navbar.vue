<script setup lang="ts">
import { useToast } from "vue-toastification";

const toast = useToast();

const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

let colorMode = useColorMode();
let darkMode = ref<boolean>(false);

const toggleMode = (): void => {
  if (colorMode.preference === "light") {
    colorMode.preference = "dark";
  } else {
    colorMode.preference = "light";
  }
};

const profileId = ref<number>();

const getUserId = async () => {
  const {
    data: { profile_id },
    error,
  } = await client
    .from("profiles")
    .select("profile_id")
    .match({ id: user.value.id })
    .single();

  profileId.value = profile_id;
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
  colorMode.value === "dark" ? (darkMode.value = false) : (darkMode.value = true);
  if (user.value) {
    getUserId();
  }
});

watch(colorMode, (color) => {
  color.preference === "dark" ? (darkMode.value = false) : (darkMode.value = true);
});
</script>

<template>
  <nav class="navbar">
    <form class="navbar__search">
      <span class="material-icons md-24">search</span>
      <input type="text" class="navbar__search-input" placeholder="Szukaj" />
    </form>
    <label id="switch" class="switch">
      <input type="checkbox" @click="toggleMode()" v-model="darkMode" id="slider" />
      <span class="slider round"></span>
    </label>

    <div class="navbar__buttons">
      <div ref="notificationsEl" class="navbar__dropdown navbar__dropdown--notifications">
        <tippy content="Powiadomienia">
          <button @click="toggleNotifications" class="navbar__toggle">
            <span class="material-icons md-30 icon">notifications</span>
          </button>
        </tippy>

        <!-- <span class="navbar__badge">3</span> -->
        <Transition name="scale">
          <div
            v-if="notificationsVisible"
            v-click-outside="toggleNotifications"
            class="navbar__dropdown-menu"
          >
            <p class="info">Brak powiadomień</p>
            <!-- <div class="navbar__dropdown-item"></div> -->
          </div>
        </Transition>
      </div>

      <tippy content="Dodaj pina">
        <NuxtLink ref="addPinEl" to="/pin/add" class="navbar__add">
          <span class="material-icons md-30 icon">add</span>
        </NuxtLink>
      </tippy>

      <tippy v-if="!user" content="Logowanie / Rejestracja">
        <NuxtLink ref="authEl" to="/auth" class="navbar__auth">
          <span class="material-icons md-30 icon">person</span>
        </NuxtLink>
      </tippy>

      <!-- If logged in -->
      <div
        v-else
        @click="toggleProfile"
        class="navbar__dropdown navbar__dropdown--profile"
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
            v-click-outside="toggleProfile"
            v-if="profileVisible"
            class="navbar__dropdown-menu"
          >
            <NuxtLink :to="`/profile/${profileId}`" class="navbar__dropdown-item">
              <span class="material-icons-outlined">account_circle</span>Przejdź do
              profilu
            </NuxtLink>
            <NuxtLink to="/settings" class="navbar__dropdown-item"
              ><span class="material-icons-outlined">manage_accounts</span>Edytuj profil
            </NuxtLink>
            <button @click.prevent="handleLogout" class="navbar__dropdown-item">
              <span class="material-icons-outlined">logout</span>Wyloguj się
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
  width: 100%;
  height: 4rem;
  padding: 0.5rem 2rem;

  @media only screen and (max-width: 50em) {
    padding: 0.5rem 1rem;
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
    margin-right: 2rem;

    & .material-icons {
      position: absolute;
      left: 0.5rem;
      pointer-events: none;
    }

    &-input {
      transition: all 0.2s;
      width: 100%;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      padding: 0.6rem;
      padding-left: 2.5rem;
      border-radius: 1rem;
      background-color: var(--bg-color-secondary);
      font-size: 1rem;
      color: var(--font-color);

      &:focus {
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
      }
    }

    @media only screen and (max-width: 50em) {
      margin-right: 1rem;
    }

    @media only screen and (max-width: 37.5em) {
      margin-right: 0.5rem;
    }
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;
  }

  &__dropdown {
    position: relative;
    color: var(--font-color);

    &-menu {
      position: absolute;
      right: 0;
      top: 1rem;
      z-index: 1;
      display: flex;
      flex-direction: column;
      width: 12rem;
      margin-top: 2rem;
      overflow: hidden;
      border-radius: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      background-color: var(--bg-color-secondary);
      font-size: 0.9rem;
      text-align: center;
    }

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

    & span {
      color: var(--bg-color-secondary);

      @media only screen and (max-width: 37.5em) {
        font-size: 24px;
      }
    }

    @media only screen and (max-width: 50em) {
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
  &__dropdown--profile {
    @media only screen and (max-width: 50em) {
      position: fixed;
      top: 0.2rem;
      right: 0.7rem;
      z-index: 100;

      &-img {
        position: fixed;
      }
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

nav button:last-child {
  margin-right: 0;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  margin-right: 1.5rem;
  width: 60px;
  height: 26px;

  @media only screen and (max-width: 50em) {
    margin-right: 1rem;
  }

  @media only screen and (max-width: 37.5em) {
    transform: scale(0.8);
    margin-right: 0.5rem;
  }
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 36px;
  width: 36px;
  left: -2px;
  bottom: 4px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: 0 0px 15px #2020203d;
  background: white url("https://i.ibb.co/FxzBYR9/night.png");
  background-repeat: no-repeat;
  background-position: center;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(28px);
  background: white url("https://i.ibb.co/7JfqXxB/sunny.png");
  background-repeat: no-repeat;
  background-position: center;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
