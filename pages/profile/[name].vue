<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
const router = useRoute();

const config = useRuntimeConfig();

// Fetch images
const { data: images } = useAsyncData("userImages", async () => {
  let response: any;
  try {
    response = $fetch(`https://api.unsplash.com/photos/random`, {
      params: {
        count: 20,
        client_id: config.UNSPLASH_API_KEY,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return response;
});

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

    <div class="profile">
      <div class="profile__background"></div>
      <img
        class="profile__avatar"
        src="https://www.coolgenerator.com/Pic/Face//male/male2016108666040345.jpg"
        alt="Profile page"
      />
      <h2 class="profile__name">John</h2>
      <p class="profile__info">Info o użytkowniku</p>
      <p class="profile__follows">
        <span class="profile__followers">56 obserwujących, </span>
        <span class="profile__following">5 obserwowanych</span>
      </p>
      <!-- <button class="profile__follow">Obserwuj</button> -->
      <NuxtLink to="/settings" class="profile__edit">Edytuj profil</NuxtLink>
      <div class="profile__btns">
        <button class="profile__btns-created active">Utworzone</button>
        <button class="profile__btns-saved">Zapisane</button>
      </div>
    </div>
    <div class="pins">
      <PinCard v-for="image in images" :key="image.id" :image="image" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
@mixin button {
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.active {
  padding: 0.75rem;
  border-radius: 2rem;
  background-color: var(--primary-color);
  color: #eee;

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
  }
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
    background-image: url("https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  &__avatar {
    transform: translateY(-50%);
    width: 7.5rem;
    height: 7.5rem;
    margin-bottom: -4rem;
    border: 2px solid var(--bg-color-primary);
    border-radius: 50%;
  }

  &__name {
    margin-top: 0.5rem;
    font-size: 1.6rem;
    color: var(--heading-color);
    font-weight: 500;
  }

  &__info {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--font-color);
  }

  &__follows {
    margin-top: 0.5rem;
    font-size: 0.9rem;
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
  &__btns {
    margin-top: 1rem;
    color: var(--font-color);

    &-created {
      @include button;
      margin-right: 1rem;
    }
    &-saved {
      @include button;
    }
  }
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
