<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
import { User } from "~~/models/user";
import { Pin } from "~~/models/pin";

const route = useRoute();
const client = useSupabaseClient();

const { fetchUserPins, fetchSavedPins, pins, pinsLoading } = usePins();

const profileId = route.params.id;
const isOwner = ref<boolean>(false);

const userInfo = ref<User>();

let isLoading = ref<boolean>();

const getUser = async () => {
  isLoading.value = true;
  try {
    const { data: profile, error } = await client
      .from("profiles")
      .select()
      .match({ profile_id: profileId })
      .single();

    if (error) throw error;

    const {
      id,
      avatar_url,
      full_name,
      username,
      bio,
      website,
      background_url,
      profile_id,
      email,
    } = profile;

    userInfo.value = profile;

    isOwner.value = id === client.auth.user().id ? true : false;

    fetchUserPins(id);

    console.log(userInfo);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// let showModal = ref();

// function displayPinModal(route) {
//   showModal.value = route.params.id;
//   console.log(showModal.value);
//   window.history.pushState({}, null, route.path);
// }

// function hidePinModal() {
//   showModal.value = null;
//   window.history.pushState({}, null, router.path);
// }

// onBeforeRouteLeave((to, from, next) => {
//   if (to.name === "pin-id") {
//     displayPinModal(to);
//   } else {
//     next();
//   }
// });

type PinTab = "created" | "saved";

let activeTab = ref<PinTab>("created");

const changePinTab = (tab: PinTab) => {
  activeTab.value = tab;

  tab === "created"
    ? fetchUserPins(userInfo.value.id)
    : fetchSavedPins(userInfo.value.id);
};

onMounted(() => {
  getUser();
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <main>
    <!-- <div v-if="showModal">
      <h1>Modal</h1>
      <button @click="hidePinModal">Hide pin modal</button>
    </div> -->

    <div v-if="userInfo" class="profile">
      <div
        v-if="userInfo.background_url"
        :style="{
          background: `url(${userInfo?.background_url}) no-repeat center `,
          backgroundSize: 'cover',
        }"
        class="profile__background"
      ></div>
      <img
        class="profile__avatar"
        :class="{ 'move-top': userInfo?.background_url }"
        :src="
          userInfo?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        "
        alt="Profile page"
      />
      <div class="profile__info">
        <h2 class="profile__name">{{ userInfo?.username }}</h2>
        <p class="profile__bio">{{ userInfo?.bio }}</p>
        <NuxtLink
          :to="`//${userInfo?.website}`"
          target="_blank"
          class="profile__website"
          >{{ userInfo?.website }}</NuxtLink
        >
        <p class="profile__follows">
          <span class="profile__followers">56 obserwujących, </span>
          <span class="profile__following">5 obserwowanych</span>
        </p>
      </div>

      <NuxtLink v-if="isOwner" to="/settings" class="profile__edit"
        >Edytuj profil
      </NuxtLink>
      <button v-else class="profile__follow">Obserwuj</button>
      <div class="profile__btns">
        <button
          @click="changePinTab('created')"
          :class="{ active: activeTab === 'created' }"
          class="profile__btn"
        >
          Utworzone
        </button>
        <button
          @click="changePinTab('saved')"
          :class="{ active: activeTab === 'saved' }"
          class="profile__btn"
        >
          Zapisane
        </button>
      </div>
    </div>

    <div class="pins">
      <PinCard v-for="pin in pins" :key="pin.id" :pin="pin" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.active {
  padding: 0.75rem;
  border-radius: 2rem;
  background-color: var(--primary-color);
  color: #eee;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 2rem;

  @media only screen and (max-width: 50em) {
    margin: 0 1rem;
  }
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;

  &__background {
    max-width: 40rem;
    width: 100%;
    height: 22.5rem;
    border-radius: 2rem;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  }

  &__avatar {
    width: 7.5rem;
    height: 7.5rem;
    border: 2px solid var(--bg-color-primary);
    border-radius: 50%;
  }

  &__name {
    margin-top: 0.5rem;
    font-size: 1.8rem;
    color: var(--heading-color);
    font-weight: 500;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    color: var(--font-color);
  }

  &__edit,
  &__follow {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background-color: var(--btn-bg);
    color: var(--btn-color);
    cursor: pointer;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }

  &__website {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__follows,
  &__website {
    font-weight: 500;
  }

  &__btns {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  &__btn {
    padding: 0.75rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;

    &:not(.active) {
      color: var(--font-color);
    }

    &:not(.active):hover {
      background-color: rgba(var(--opacity-color), 0.1);
    }
  }
}

.move-top {
  transform: translateY(-50%);
  margin-bottom: -4rem;
}

.pins {
  margin: 2rem auto;
  columns: 5;
  column-gap: 1rem;
  font-size: 1.2rem;

  @media only screen and (max-width: 87.5em) {
    columns: 4;
  }

  @media only screen and (max-width: 75em) {
    columns: 3;
  }

  @media only screen and (max-width: 37.5em) {
    columns: 2;
  }

  @media only screen and (max-width: 25em) {
    columns: 1;
  }
}
</style>
