<template>
  <div class="wrapper">
    <Sidebar />
    <main class="wrapper-inner">
      <Topbar />
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
// @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
@import "assets/styles/main";

:root {
  --primary-color: #20c0ff;
  --font-color: #444444;
  --bg-color-primary: #f0f0f0;
  --bg-color-secondary: #f9f9f9;
  --heading-color: #2c2c2c;
  --icon-color: #3d3d3d;
  --opacity-color: 0, 0, 0;
}

.dark-mode {
  --primary-color: #bd53ff;
  --font-color: #f0e1ff;
  --bg-color-primary: #1c1c1c;
  --bg-color-secondary: #2d2d2d;
  --heading-color: #eee;
  --icon-color: #eee;
  --opacity-color: 255, 255, 255;
}

body {
  background-color: var(--bg-color-primary);
  font-family: "Roboto", sans-serif;
  transition: 0.2s ease-in-out;
}

.wrapper {
  display: flex;
}

.wrapper-inner {
  flex-direction: column;
  width: 100%;
}

.material-icons,
.material-icons-outlined {
  user-select: none;
  color: var(--icon-color);
  transition: all 0.2s;

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
}
</style>
