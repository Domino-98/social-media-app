<script setup lang="ts">
import { react } from "@babel/types";

let colorMode = useColorMode();

let darkMode = ref<boolean>(false);

if (process.client) {
  colorMode.value === "dark"
    ? (darkMode.value = false)
    : (darkMode.value = true);
}

const toggleMode = () => {
  if (colorMode.value === "light") {
    colorMode.value = "dark";
  } else {
    colorMode.value = "light";
  }
  console.log(colorMode.value);
  return colorMode.value;
};
</script>

<template>
  <nav class="topbar">
    <form class="topbar__search">
      <span class="material-icons md-24">search</span>
      <input type="text" class="topbar__search-input" placeholder="Szukaj" />
    </form>
    <label id="switch" class="switch">
      <input
        type="checkbox"
        @click="$colorMode.preference = toggleMode()"
        v-model="darkMode"
        id="slider"
      />
      <span class="slider round"></span>
    </label>
    <button class="topbar__notifications">
      <span class="material-icons md-30">notifications</span>
      <!-- <span class="topbar__notifications-number">3</span> -->
      <!-- <Transition>
        <div class="topbar__notifications-dropdown">
          <p>Brak powiadomień</p>
        </div>
      </Transition> -->
    </button>
    <button class="topbar__add">
      <span class="material-icons md-30">add</span>
    </button>

    <button class="topbar__profile">
      <span class="material-icons md-30">person</span>
      <!-- If logged in -->
      <!-- <img
        class="topbar__profile-img"
        src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
        alt="Profile page"
      /> -->
      <!-- <img
        class="topbar__profile-img"
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="Profile page"
      /> -->
    </button>
    <!-- If logged in -->
    <!-- <button class="topbar__logout" data-customTooltip="Wyloguj się">
      <span class="material-icons md-30">logout</span>
    </button> -->
  </nav>
</template>

<style lang="scss" scoped>
.topbar {
  align-self: end;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 10;
  height: 4rem;
  padding: 0.5rem 2rem;

  &__logo {
    margin-right: auto;
    font-size: 2rem;
    color: var(--primary-color);
    font-weight: 400;
  }

  &__search {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 2rem;
    flex: 1;

    & .material-icons {
      position: absolute;
      pointer-events: none;
      left: 0.5rem;
    }

    &-input {
      width: 100%;
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
      padding: 0.5rem;
      padding-left: 2.5rem;
      font-size: 1rem;
      border-radius: 1rem;
      background-color: var(--bg-color-secondary);
      color: var(--font-color);
      transition: all 0.2s;

      &:focus {
        box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
      }
    }
  }

  &__notifications,
  &__add,
  &__profile,
  &__logout {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.75rem;
    width: 2.8rem;
    height: 2.8rem;
    background-color: var(--bg-color-secondary);
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: all 0.2s;

    &:hover .material-icons {
      filter: brightness(150%);
    }

    &-number {
      position: absolute;
      top: -0.25rem;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      background-color: var(--primary-color);
      color: var(--font-color);
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 500;
    }

    &-dropdown {
      position: absolute;
      right: 0;
      bottom: -3.6rem;
      margin-top: 2rem;
      background-color: var(--bg-color-secondary);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      padding: 0.5rem;
      font-size: 0.9rem;
      border-radius: 0.5rem;
      text-align: center;
    }
  }

  &__profile {
    &-img {
      width: 3rem;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
    }
  }
}

nav button:last-child {
  margin-right: 0;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  margin-right: 1.5rem;
  width: 60px;
  height: 26px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 36px;
  width: 36px;
  left: -2px;
  bottom: 4px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: 0 0px 15px #2020203d;
  background: white url("https://i.ibb.co/FxzBYR9/night.png");
  background-repeat: no-repeat;
  background-position: center;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(24px);
  -ms-transform: translateX(24px);
  transform: translateX(28px);
  background: white url("https://i.ibb.co/7JfqXxB/sunny.png");
  background-repeat: no-repeat;
  background-position: center;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
