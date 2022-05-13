<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";

const config = useRuntimeConfig();
const router = useRoute();

const { data: images } = useAsyncData("photos", async () => {
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

let showModal = ref();

function displayPinModal(route) {
  showModal.value = route.params.id;
  console.log(showModal.value);
  window.history.pushState({}, null, route.path);
}

function hidePinModal() {
  showModal.value = null;
  window.history.pushState({}, null, router.path);
}

onBeforeRouteLeave((to, from, next) => {
  if (to.name === "pin-id") {
    displayPinModal(to);
  } else {
    next();
  }
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="container">
    <div v-if="showModal">
      <h1>Modal</h1>
      <button @click="hidePinModal">Hide pin modal</button>
    </div>

    <div v-if="images" class="photo" v-for="image in images" :key="image.id">
      <NuxtLink
        :to="{
          name: 'pin-id',
          params: { id: image.id },
        }"
      >
        <img class="photo__img" :src="image.urls.regular"
      /></NuxtLink>

      <div class="photo__profile">
        <img
          class="photo__profile-img"
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile page"
        />
        <p class="photo__profile-name">Dominik Buczek</p>
        <button class="photo__save">Zapisz</button>
        <button class="photo__delete">
          <span class="material-icons md-18">delete</span>
        </button>
        <button class="photo__download">
          <span class="material-icons md-18">file_download</span>
        </button>
        <button class="photo__share">
          <span class="material-icons md-18">ios_share</span>
        </button>
        <button class="photo__like">
          <span class="material-icons md-30">favorite_border</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: auto;
  padding: 2rem;
  columns: 5;
  column-gap: 1rem;
  font-size: 1.2rem;
}
.photo {
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 0 0 1rem;
  break-inside: avoid;

  &__save {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: none;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background-color: var(--primary-color);
    color: #eee;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }

  &__delete,
  &__download,
  &__share,
  &__like {
    position: absolute;
    display: none;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: var(--bg-color-primary);
    color: #252525;
    cursor: pointer;

    &:hover span {
      color: var(--primary-color);
    }
  }

  &__delete {
    top: 0.5rem;
    left: 0.5rem;
  }

  &__download {
    bottom: 3rem;
    right: 0.5rem;
  }

  &__share {
    bottom: 3rem;
    left: 0.5rem;
  }

  &__like {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -75%);
    width: 3rem;
    height: 3rem;

    & span {
      color: var(--primary-color);
    }
  }

  &:hover &__img {
    filter: brightness(60%);
  }

  &:hover &__save {
    display: block;
  }

  &:hover &__delete,
  &:hover &__download,
  &:hover &__share,
  &:hover &__like {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    width: 100%;
    border-radius: 0.75rem;
    cursor: pointer;
  }

  &__profile {
    display: flex;
    align-items: center;
    margin-top: 0.25rem;

    &-img {
      width: 1.75rem;
      margin-right: 0.5rem;
      border-radius: 50%;
      cursor: pointer;
    }

    &-name {
      color: var(--font-color);
      font-size: 0.7rem;
      font-weight: 500;
    }
  }
}
</style>
