<template>
  <div>
    <slot />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap");
@import "assets/styles/main";

:root {
  --primary-color: #20c0ff;
  --font-color: #363636;
  --bg-color-primary: rgb(247 248 249);
  --bg-color-secondary: #fff;
  --heading-color: #252525;
  --icon-color: #3d3d3d;
  --btn-bg: #7b7b7b;
  --btn-color: #fff;
  --opacity-color: 0, 0, 0;
}

.dark-mode {
  --primary-color: #bd53ff;
  --font-color: #ececec;
  --bg-color-primary: #1b1b1b;
  --bg-color-secondary: #2d2d2d;
  --heading-color: #f5f5f5;
  --icon-color: #eee;
  --opacity-color: 255, 255, 255;
}

body {
  transition: 0.2s ease-in-out;
  background-color: var(--bg-color-primary);
  font-family: "Roboto", sans-serif;
}

html {
  @media only screen and (max-width: 62.5em) {
    font-size: 92.5%;
  }

  @media only screen and (max-width: 37.5em) {
    font-size: 85%;
  }
}

.material-icons,
.material-icons-outlined {
  transition: all 0.2s;
  color: var(--icon-color);
  user-select: none;

  &.md-18 {
    font-size: 18px;
  }
  &.md-24 {
    font-size: 24px;
  }
  &.md-30 {
    font-size: 30px;
  }
  &.md-36 {
    font-size: 36px;
  }
  &.md-42 {
    font-size: 42px;
  }
}
</style>
