<script setup lang="ts">
import { categories } from "~~/data";

let menuOpened = ref<boolean>(false);
</script>

<template>
  <div class="sidebar">
    <button
      class="menu-btn"
      @click.prevent="menuOpened = !menuOpened"
      :class="{ opened: menuOpened }"
      aria-label="Main Menu"
    >
      <svg width="40" height="40" viewBox="0 0 100 100">
        <path
          class="line line1"
          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
        />
        <path class="line line2" d="M 20,50 H 80" />
        <path
          class="line line3"
          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
        />
      </svg>
    </button>
    <NuxtLink to="/" class="sidebar__logo">
      <span class="material-icons-outlined md-36">camera</span>
      <h1 class="sidebar__logo-text">We<span>Share</span></h1>
    </NuxtLink>

    <!-- <NuxtLink to="/auth" class="sidebar__profile">
      <span class="material-icons md-24">person</span>
    </NuxtLink> -->
    <!-- If logged in -->
    <!-- <button class="sidebar__logout" data-customTooltip="Wyloguj się">
      <span class="material-icons md-24">logout</span>
    </button> -->

    <div :class="{ 'menu-opened': menuOpened }" class="sidebar__content">
      <ul class="sidebar__list">
        <NuxtLink @click="menuOpened = false" to="/">
          <li class="sidebar__item sidebar__item--home active">
            <span class="material-icons md-24">home</span>
            Strona główna
          </li>
        </NuxtLink>
        <li class="sidebar__item sidebar__item--popular">
          <span class="material-icons md-24">whatshot</span>
          Popularne
        </li>
      </ul>
      <h2 class="sidebar__categories-header">Kategorie</h2>
      <ul class="sidebar__list">
        <li
          v-for="category in categories"
          :key="category.name"
          class="sidebar__item"
        >
          <img
            :src="category.img"
            alt="cars"
            class="sidebar__categories-icon"
          />
          {{ category.name }}
        </li>
      </ul>
    </div>
  </div>
  <Transition>
    <div
      v-if="menuOpened"
      @click="menuOpened = false"
      class="menu-overlay"
    ></div>
  </Transition>
</template>

<style lang="scss" scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: 0.2s ease-in-out;
  width: 100%;
  height: 100vh;
  max-width: 15rem;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
  padding-top: 0.5rem;
  background-color: var(--bg-color-secondary);
  z-index: 100;

  @media only screen and (max-width: 62.5em) {
    max-width: 12.5rem;
  }

  @media only screen and (max-width: 50em) {
    max-width: 100%;
    height: 100%;
    padding-top: 0;
    flex-direction: row;
    align-items: center;
    padding: 0.25rem;
  }

  &__logo {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    margin-left: 1rem;
    text-transform: uppercase;
    cursor: pointer;

    & span {
      color: var(--font-color);

      @media only screen and (max-width: 50em) {
        font-size: 30px;
      }
    }

    &-text {
      font-family: "Rubik", "sans-serif";
      font-size: 1.5rem;
      color: var(--primary-color);
      font-weight: 500;

      @media only screen and (max-width: 50em) {
        font-size: 1.3rem;
      }

      & span {
        @media only screen and (max-width: 50em) {
          font-size: 1.3rem;
        }
      }
    }

    @media only screen and (max-width: 50em) {
      align-self: center;
      justify-self: center;
      transform: translateX(-1.5rem);
      margin: 0 auto;
      font-size: 1.3rem;
    }
  }

  &__categories-header {
    margin: 0.5rem 0;
    margin-left: 1rem;
    color: var(--font-color);
    font-size: 1.2rem;
    font-weight: 500;
  }

  &__categories-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 0.75rem;
  }

  &__content {
    background-color: var(--bg-color-secondary);
    z-index: 10;

    @media only screen and (max-width: 50em) {
      visibility: hidden;
      position: absolute;
      transform: translateX(-100%);
      transition: all 0.3s ease-in-out;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100vh - 46.8px);
      max-width: 12.5rem;
      margin-top: 46.8px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    transition: all 0.2s;
    padding: 0.4rem;
    padding-left: 1.5rem;
    color: var(--font-color);
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;

    & .material-icons-outlined {
      width: 2rem;
    }

    &:hover:not(.active) {
      background-color: rgba(var(--opacity-color), 0.1);
    }

    & span {
      margin-right: 0.5rem;
    }

    &.active {
      padding-left: 1.15rem;
      border-left: 0.35rem solid var(--primary-color);
      background-color: rgba(0, 0, 0, 0.1);
      font-weight: 700;
    }
  }

  &__profile,
  &__logout {
    display: none;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.75rem;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    background-color: var(--heading-color);
    cursor: pointer;

    & span {
      color: var(--bg-color-secondary);
    }

    &:hover span {
      color: var(--primary-color);
    }

    &-img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }

    @media only screen and (max-width: 50em) {
      display: flex;
    }
  }
}

.menu-btn {
  display: none;
  align-items: center;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  z-index: 10;

  @media only screen and (max-width: 50em) {
    display: flex;
  }
}

.line {
  fill: none;
  stroke: var(--icon-color);
  stroke-width: 6;
  transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
    stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.line1 {
  stroke-dasharray: 60 207;
  stroke-width: 5;
}
.line2 {
  stroke-dasharray: 60 60;
  stroke-width: 5;
}
.line3 {
  stroke-dasharray: 60 207;
  stroke-width: 5;
}
.opened .line1 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 5;
}
.opened .line2 {
  stroke-dasharray: 1 60;
  stroke-dashoffset: -30;
  stroke-width: 5;
}
.opened .line3 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 5;
}

.menu-opened {
  visibility: visible;
  transform: translateX(0%);
}

.menu-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 1;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
