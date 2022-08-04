<template>
  <Transition name="page">
    <div>
      <slot />
    </div>
  </Transition>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap");

:root {
  --primary-color: #3cc8ff;
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
</style>
