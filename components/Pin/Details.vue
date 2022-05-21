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

let infoEl = ref();
let imgEl = ref();
let imgHeight = ref<number>();

function setHeight() {
  imgHeight.value = imgEl.value?.clientHeight;
}

let showComments = ref<boolean>(true);

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="pin">
    <img
      ref="imgEl"
      class="pin__img"
      :class="{ rounded: infoEl?.clientHeight > imgHeight }"
      :src="image.urls.regular"
      alt=""
      @load="setHeight()"
    />
    <div class="pin__info" ref="infoEl">
      <div class="pin__btns">
        <span class="material-icons md-24 pin__download">file_download</span>
        <span class="material-icons md-24 pin__share">ios_share</span>
        <div class="pin__likes">
          <span class="material-icons md-24 pin__like">favorite_border</span>
          <span>5</span>
        </div>

        <button class="pin__save">Zapisz</button>
      </div>
      <a href="#" class="pin__link">link.com</a>
      <h1 class="pin__title">Pin Title</h1>
      <p class="pin__description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, dolorem?
      </p>
      <NuxtLink to="/profile/john" class="pin__profile">
        <img
          class="pin__profile-avatar"
          src="https://www.coolgenerator.com/Pic/Face//male/male2016108666040345.jpg"
          alt=""
        />
        <span class="pin__profile-name">John</span>
        <div class="pin__profile-follow">Obserwuj</div>
      </NuxtLink>
      <div class="pin__comments">
        <h2 class="pin__comments-header">2 Komentarze</h2>
        <span
          v-if="showComments"
          @click="showComments = !showComments"
          class="material-icons-outlined md-30"
        >
          expand_more
        </span>
        <span
          v-else
          @click="showComments = !showComments"
          class="material-icons-outlined md-30"
        >
          expand_less
        </span>
        <div v-if="showComments" class="pin__comments-list">
          <div class="pin__comments-item">
            <img
              class="pin__comments-avatar"
              src="https://www.coolgenerator.com/Pic/Face//female/female1023241532165.jpg"
              alt=""
            />
            <div class="pin__comments-info">
              <span class="pin__comments-name">Olivia</span>
              <p class="pin__comments-text">Great!</p>
            </div>
          </div>
          <div class="pin__comments-item">
            <img
              class="pin__comments-avatar"
              src="https://www.coolgenerator.com/Pic/Face//male/male1084956637451.jpg"
              alt=""
            />
            <div class="pin__comments-info">
              <span class="pin__comments-name">Robert</span>
              <p class="pin__comments-text">Nice photo!</p>
            </div>
          </div>
          <div class="pin__comments-item"></div>
        </div>
        <div class="pin__comments-add">
          <img
            class="pin__comments-avatar pin__comments-avatar"
            src="https://www.coolgenerator.com/Pic/Face//male/male2016108666040345.jpg"
            alt=""
          />
          <input class="pin__comments-input" placeholder="Dodaj komentarz" />
          <span class="material-icons-outlined pin__comments-btn">send</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pin {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  max-width: 62.5rem;
  margin-top: 0.5rem;
  border-radius: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: var(--bg-color-secondary);
  color: var(--font-color);

  @media only screen and (max-width: 37.5em) {
    flex-direction: column;
    margin-left: 2rem;
    margin-right: 2rem;
  }

  &__img {
    align-self: flex-start;
    display: block;
    width: 50%;

    @media only screen and (max-width: 37.5em) {
      width: 100%;
    }
  }

  &__info {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 0.5rem;
    padding: 1.5rem;

    @media only screen and (max-width: 37.5em) {
      width: 100%;
    }
  }

  &__btns {
    display: flex;
    justify-content: space-between;
  }

  &__likes {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  &__download,
  &__share,
  &__like {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.25rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      background-color: var(--bg-color-primary);
      color: var(--primary-color);
    }
  }

  &__like {
    color: var(--primary-color);
  }

  &__link {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  &__title {
    font-size: 2.2rem;
    font-weight: 500;
    color: var(--heading-color);
  }

  &__description {
    font-size: 0.9rem;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &-name {
      font-weight: 500;
      color: var(--heading-color);
    }

    &-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    &-follow {
      margin-left: auto;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      background-color: var(--btn-bg);
      color: var(--btn-color);
      cursor: pointer;

      &:hover {
        background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
      }
    }
  }

  &__comments {
    margin-top: 0.5rem;

    &-header {
      display: inline-block;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--heading-color);

      & + span {
        display: inline-block;
        vertical-align: middle;
        transition: all 0.3s;
        margin-left: 0.5rem;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          background-color: var(--bg-color-primary);
          color: var(--primary-color);
        }
      }
    }

    &-list {
      margin-bottom: 1rem;
    }

    &-item {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    &-avatar {
      align-self: flex-start;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }

    &-info {
      align-self: flex-start;
    }

    &-name {
      font-weight: 500;
      color: var(--heading-color);
    }

    &-text {
      font-size: 0.9rem;
    }

    &-add {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    &-input {
      width: 100%;
      background-color: var(--bg-color-primary);
      padding: 0.5rem;
      border-radius: 1rem;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
      font-size: 0.9rem;
    }

    &-btn {
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  &__save {
    align-self: center;
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
}

.rounded {
  max-width: calc(50% - 1rem);
  margin: 1rem;
  border-radius: 1rem;

  @media only screen and (max-width: 37.5em) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
