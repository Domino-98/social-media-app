<script setup lang="ts">
import { categories } from "~~/data";
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <span class="material-icons-outlined md-36">camera</span>
      <h1 class="sidebar__logo-text">We<span>Share</span></h1>
    </div>
    <ul class="sidebar__list">
      <li class="sidebar__item sidebar__item--home active">
        <span class="material-icons md-24">home</span>Odkrywaj
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
  display: flex;
  flex-direction: column;
  position: sticky;
  width: 100%;
  height: 100vh;
  max-width: 15rem;
  background-color: var(--bg-color-secondary);
  box-shadow: 0 0 8px 0 #2020203d;

  padding-top: 0.5rem;

  &__logo {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    margin-left: 1rem;

    &-text {
      font-size: 1.8rem;
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
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  }

  &__item {
    display: flex;
    align-items: center;
    color: var(--font-color);
    padding: 0.4rem;
    padding-left: 1.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 400;
    transition: all 0.2s;

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
      border-left: 0.35rem solid var(--primary-color);
      background-color: rgba(0, 0, 0, 0.1);
      padding-left: 1.15rem;
      font-weight: 700;
    }
  }
}
</style>
