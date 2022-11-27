<script setup lang="ts">
import type { User } from "~~/models/user";
import profilesApi from "~~/services/api_profiles";
import relationsApi from "~~/services/api_relations";
import { onClickOutside } from "@vueuse/core";
import { useToast, TYPE } from "vue-toastification";

const route = useRoute();
const user = useSupabaseUser();
const toast = useToast();
const userProfile = useUser();

const profileId = route.params.id;
const isOwner = ref<boolean>(false);
const userInfo = ref<User>();
const userLoading = ref<boolean>();

const getUserProfile = async () => {
  userLoading.value = true;
  try {
    const fetchedProfile = await profilesApi().getUser(+profileId);
    console.log(fetchedProfile);
    userInfo.value = fetchedProfile as User;
    isOwner.value = fetchedProfile.id === user.value?.id ? true : false;
  } catch (error) {
    console.error(error);
  } finally {
    userLoading.value = false;
  }
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
        userInfo.value?.id as string,
        userProfile.value!
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

const chatEl = ref();

onClickOutside(chatEl, (e: Event) => {
  if ((e.target as HTMLElement).id !== "sendBtn") toggleChat();
});

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
        <p v-if="userInfo.bio" class="profile__bio">{{ userInfo.bio }}</p>
        <NuxtLink
          v-if="userInfo.website"
          :to="`//${userInfo.website}`"
          target="_blank"
          class="profile__website"
          >{{ userInfo.website }}</NuxtLink
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
    </div>

    <ProfilePins v-if="userInfo" :user-id="userInfo.id" />

    <span v-if="userLoading" class="loading-spinner"></span>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 2rem;

  @media only screen and (max-width: 62.5em) {
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
</style>
