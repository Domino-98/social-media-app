<script setup lang="ts">
let scrollVisible = ref<boolean>(false);

function scrollListener(e: Event) {
  scrollVisible.value = window.scrollY > 500;
}

onMounted(() => {
  window.addEventListener("scroll", scrollListener);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollListener);
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <div class="wrapper">
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

  @media only screen and (max-width: 50em) {
    flex-direction: column;
  }
}

.wrapper-inner {
  flex-direction: column;
  width: 100%;
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
