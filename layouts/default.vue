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
  --font-color: #444444;
  --bg-color-primary: #eee;
  --bg-color-secondary: #ffffff;
  --heading-color: #2c2c2c;
  --icon-color: #3d3d3d;
  --opacity-color: 0, 0, 0;
}

.dark-mode {
  --primary-color: #bd53ff;
  --font-color: #f0e1ff;
  --bg-color-primary: #1b1b1b;
  --bg-color-secondary: #2d2d2d;
  --heading-color: #eee;
  --icon-color: #eee;
  --opacity-color: 255, 255, 255;
}

body {
  transition: 0.2s ease-in-out;
  background-color: var(--bg-color-primary);
  font-family: "Roboto", sans-serif;
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
