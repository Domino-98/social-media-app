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
  <div class="container">
    <!-- <div v-if="showModal">
      <h1>Modal</h1>
      <button @click="hidePinModal">Hide pin modal</button>
    </div> -->

    <div class="profile">
      <div class="profile__background"></div>
      <img
        class="profile__avatar"
        src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
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
    <div class="photos">
      <PinCard v-for="image in images" :key="image.id" :image="image" />
    </div>
  </div>
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

.container {
  width: 100%;
  padding: 0 2rem;
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;

  &__background {
    max-width: 40rem;
    width: 100%;
    height: 22.5rem;
    border-radius: 2rem;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
    background-image: url("https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80");
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

.photos {
  margin: 2rem auto;
  columns: 5;
  column-gap: 1rem;
  font-size: 1.2rem;
}
</style>
