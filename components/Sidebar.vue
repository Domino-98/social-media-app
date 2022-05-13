<script setup lang="ts">
import { categories } from "~~/data";
</script>

<template>
  <div class="sidebar">
    <a href="#" class="sidebar__logo">
      <span class="material-icons-outlined md-36">camera</span>
      <h1 class="sidebar__logo-text">We<span>Share</span></h1>
    </a>
    <ul class="sidebar__list">
      <li class="sidebar__item sidebar__item--home active">
        <span class="material-icons md-24">home</span>Strona główna
      </li>
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
        <img :src="category.img" alt="cars" class="sidebar__categories-icon" />
        {{ category.name }}
      </li>
    </ul>
  </div>
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
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  padding-top: 0.5rem;
  background-color: var(--bg-color-secondary);

  &__logo {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    margin-left: 1rem;
    text-transform: uppercase;
    cursor: pointer;

    &-text {
      font-family: "Rubik", "sans-serif";
      font-size: 1.5rem;
      color: var(--primary-color);
      font-weight: 500;

      & span {
        color: var(--font-color);
      }
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
      background-color: rgba(0, 0, 0, 0.1);
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
}
</style>
