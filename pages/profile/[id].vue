<script setup lang="ts">
import type { User } from "~~/models/user";
import pinsApi from "~~/services/api_pins";
import profilesApi from "~~/services/api_profiles";
import relationsApi from "~~/services/api_relations";
import { onClickOutside } from "@vueuse/core";
import { useToast, TYPE } from "vue-toastification";
import { Pin } from "~~/models/pin";

const route = useRoute();
const user = useSupabaseUser();
const toast = useToast();

const { userPins, savedPins } = usePins();

const profileId = route.params.id;
const isOwner = ref<boolean>(false);

const userInfo = ref<User>();

const userLoading = ref<boolean>();
const pinsLoading = ref<boolean>();

const getUserPins = async (userId: string) => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await pinsApi().fetchUserPins(userId);
    userPins.value = fetchedPins as Pin[];
  } catch (error) {
    console.error(error);
  } finally {
    pinsLoading.value = false;
  }
};

const getSavedPins = async (userId: string) => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await pinsApi().fetchSavedPins(userId);
    savedPins.value = fetchedPins as Pin[];
  } catch (error) {
    console.error(error);
  } finally {
    pinsLoading.value = false;
  }
};

const getUserProfile = async () => {
  userLoading.value = true;
  try {
    const fetchedProfile = await profilesApi().getUser(+profileId);
    console.log(fetchedProfile);
    userInfo.value = fetchedProfile as User;
    isOwner.value = fetchedProfile.id === user.value?.id ? true : false;
    getUserPins(fetchedProfile.id);
  } catch (error) {
    console.error(error);
  } finally {
    userLoading.value = false;
  }
};

type PinTab = "created" | "saved";

const activeTab = ref<PinTab>("created");

const changePinTab = async (tab: PinTab) => {
  activeTab.value = tab;

  if (userInfo.value)
    tab === "created"
      ? await getUserPins(userInfo.value.id as string)
      : await getSavedPins(userInfo.value.id as string);
};

const isChatActive = ref<boolean>(false);

const toggleChat = () => {
  isChatActive.value = !isChatActive.value;
};

const isFollowed = ref<boolean>(false);

const totalFollowers = ref<number>();
const totalFollowing = ref<number>();

const followUser = async () => {
  if (user.value) {
    try {
      await relationsApi().followUser(
        user.value!.id,
        userInfo.value?.id as string
      );
      totalFollowers.value!++;
      isFollowed.value = true;
    } catch (error) {
      console.error(error);
    }
  } else {
    toast("Zaloguj się, by dodać użytkownika do obserwowanych", {
      type: TYPE.ERROR,
    });
  }
};

const unfollowUser = async () => {
  await relationsApi().unfollowUser(
    user.value!.id,
    userInfo.value?.id as string
  );
  totalFollowers.value!--;
  isFollowed.value = false;
};

onMounted(async () => {
  await getUserProfile();
  totalFollowers.value = await relationsApi().getTotalFollowers(
    userInfo.value?.id as string
  );
  totalFollowing.value = await relationsApi().getTotalFollowing(
    userInfo.value?.id as string
  );
  isOwner.value = userInfo.value!.id === user.value?.id;
  isFollowed.value = await relationsApi().checkIfFollowing(
    user.value!.id,
    userInfo.value?.id as string
  );
});

const chatEl = ref();

onClickOutside(chatEl, (e: Event) => {
  if ((e.target as HTMLElement).id !== "sendBtn") toggleChat();
});

onUnmounted(() => {
  userPins.value = [];
  savedPins.value = [];
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <main>
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
          userInfo?.avatar_url ||
          'https://cdn-icons-png.flaticon.com/512/149/149071.png'
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
          <span class="profile__followers"
            >{{ totalFollowers }} obserwujących,
          </span>
          <span class="profile__following"
            >{{ totalFollowing }} obserwowanych</span
          >
        </p>
      </div>

      <NuxtLink v-if="isOwner" to="/settings" class="btn btn--gray"
        >Edytuj profil
      </NuxtLink>

      <button
        v-if="!isFollowed && !isOwner"
        @click.prevent="followUser"
        class="btn btn--gray"
      >
        Obserwuj
      </button>
      <button
        v-if="isFollowed && !isOwner"
        @click.prevent="unfollowUser"
        class="btn btn--gray"
      >
        Przestań obserwować
      </button>
      <div v-if="!isOwner" class="profile__chat">
        <button @click.prevent="toggleChat" class="btn btn--gray" id="sendBtn">
          Wyślij wiadomość
        </button>

        <Transition name="scale">
          <ChatInput
            v-if="isChatActive"
            ref="chatEl"
            :receiver-id="userInfo.id!"
          />
        </Transition>
      </div>
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

    <div v-if="activeTab === 'created'" class="pins">
      <PinCard v-for="pin in userPins" :key="pin.id" :pin="pin" />
    </div>

    <div v-if="activeTab === 'saved'" class="pins">
      <PinCard v-for="pin in savedPins" :key="pin.id" :pin="pin" />
    </div>

    <span v-if="pinsLoading" class="loading-spinner"></span>
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
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: var(--font-color);
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

  &__chat {
    position: relative;
    margin: 0 0.5rem;
    margin-top: 0.75rem;
  }
}

.move-top {
  transform: translateY(-50%);
  margin-bottom: -4rem;
}

.pins {
  margin: 2rem auto;
  columns: 5;
  column-gap: 1.5rem;
  font-size: 1.2rem;

  @media only screen and (max-width: 87.5em) {
    columns: 4;
  }

  @media only screen and (max-width: 75em) {
    columns: 3;
    column-gap: 1rem;
  }

  @media only screen and (max-width: 37.5em) {
    columns: 2;
  }

  @media only screen and (max-width: 25em) {
    columns: 1;
  }
}

.loading-spinner {
  margin-top: 2rem;
}
</style>
