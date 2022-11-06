<template>
  <div>
    <slot />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap");

:root {
  font-size: 16px;
  --primary-color: #3cc8ff;
  --font-color: #252525;
  --bg-color-primary: rgb(247 248 249);
  --bg-color-secondary: #fff;
  --heading-color: #252525;
  --icon-color: #3d3d3d;
  --btn-bg: #7b7b7b;
  --btn-color: #fff;
  --opacity-color: 0, 0, 0;
  --font-color-filter: invert(8%) sepia(7%) saturate(2%) hue-rotate(351deg)
    brightness(99%) contrast(84%);
  --primary-color-filter: invert(60%) sepia(74%) saturate(700%) hue-rotate(168deg)
    brightness(102%) contrast(101%);
}

.dark-mode {
  --primary-color: #a556ff;
  --font-color: #ececec;
  --bg-color-primary: #151515;
  --bg-color-secondary: #292929;
  --heading-color: #f5f5f5;
  --icon-color: #eee;
  --opacity-color: 255, 255, 255;
  --font-color-filter: invert(92%) sepia(0%) saturate(1%) hue-rotate(110deg)
    brightness(104%) contrast(94%);
  --primary-color-filter: invert(50%) sepia(80%) saturate(4751%) hue-rotate(250deg)
    brightness(103%) contrast(103%);
}
</style>
