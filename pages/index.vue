<script setup lang="ts">
const config = useRuntimeConfig();

const { data: images } = await useAsyncData<any>("photos", () =>
  $fetch(`https://api.unsplash.com/photos/random`, {
    params: {
      count: 20,
      client_id: config.UNSPLASH_API_KEY,
    },
  })
);
</script>

<template>
  <div class="container">
    <div class="photo" v-for="image in images">
      <img class="photo__img" alt="" :src="image.urls.regular" />
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
  padding: 2rem;
  margin: auto;
  columns: 5;
  column-gap: 1rem;
  font-size: 1.2rem;
}
.photo {
  position: relative;
  margin: 0 0 1rem;
  display: inline-block;
  width: 100%;
  break-inside: avoid;

  &__save {
    display: none;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: #eee;
    background-color: var(--primary-color);
    border-radius: 2rem;
    padding: 0.5rem 1rem;
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
    display: none;
    position: absolute;
    width: 2rem;
    height: 2rem;
    color: #252525;
    background-color: var(--bg-color-primary);
    cursor: pointer;
    border-radius: 50%;

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
    width: 3rem;
    height: 3rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -75%);

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
    cursor: zoom-in;
  }

  &__profile {
    display: flex;
    align-items: center;
    margin-top: 0.25rem;

    &-img {
      width: 1.75rem;
      border-radius: 50%;
      cursor: pointer;
      margin-right: 0.5rem;
    }

    &-name {
      font-size: 0.7rem;
      color: var(--font-color);
      font-weight: 500;
    }
  }
}
</style>
