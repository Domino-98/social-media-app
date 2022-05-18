<script setup lang="ts">
interface Image {
  image: {
    id: string;
    urls: {
      regular: string;
    };
  };
}

const props = defineProps<Image>();
</script>

<template>
  <div class="photo">
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
</template>

<style lang="scss" scoped>
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
    align-items: center;
    justify-content: center;

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
