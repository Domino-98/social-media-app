<script setup lang="ts">
import { User } from "~~/models/user";
import profilesApi from "~~/services/api_profiles";

const scrollVisible = ref<boolean>(false);

function scrollListener(e: Event) {
  scrollVisible.value = window.scrollY > 500;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

const key = ref(0);
const messages = [
  `Uncaught NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.`, // chromium based
  `NotFoundError: The object can not be found here.`, // safari
  `NotFoundError: Node.insertBefore: Child to insert before is not a child of this node`,
];
if (typeof window !== "undefined") {
  // @ts-expect-error using arbitrary window key
  if (!window.__vue5513) {
    window.addEventListener("error", (event) => {
      if (messages.includes(event.message)) {
        event.preventDefault();
        console.warn(
          "Rerendering layout because of https://github.com/vuejs/core/issues/5513"
        );
        document.location.reload();
        return true;
      }
    });
  }
  // @ts-expect-error using arbitrary window key
  window.__vue5513 = true;
}

const user = useSupabaseUser();
const userProfile = useUser();

const setUserProfile = async () => {
  if (user.value) {
    const profile = await profilesApi().getCurrentUser(user.value.id);
    userProfile.value = profile as User;
  }
};

watch(
  () => user?.value?.id,
  async (newId) => {
    if (newId) await setUserProfile();
  },
  { deep: true }
);

onMounted(async () => {
  window.addEventListener("scroll", scrollListener);
  if (user.value) {
    await setUserProfile();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollListener);
});
</script>

<template>
  <div :key="key" class="wrapper">
  <NuxtLoadingIndicator color="var(--primary-color)" />
    <TheSidebar />
    <main class="wrapper-inner">
      <TheNavbar />
      <slot />
      <Transition name="scale">
        <button v-if="scrollVisible" @click="scrollToTop" class="scroll-top">
          <font-awesome-icon icon="fa-solid fa-arrow-up" size="xl" />
        </button>
      </Transition>
    </main>
  </div>
</template>

<style lang="scss">
.wrapper {
  display: flex;

  @media only screen and (max-width: 62.5em) {
    flex-direction: column;
  }
}

.wrapper-inner {
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.scroll-top {
  position: fixed;
  z-index: 1;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 0.75rem;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
  background-color: var(--bg-color-secondary);
  color: var(--font-color);
  cursor: pointer;

  @media only screen and (max-width: 37.5em) {
    bottom: 0.5rem;
    right: 0.5rem;
  }
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
.scale-enter-to,
.scale-leave-from {
  transform: scale(1);
  opacity: 1;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s;
}
</style>
