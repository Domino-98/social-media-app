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
.wrapper {
  display: flex;
}

.wrapper-inner {
  flex-direction: column;
  width: 100%;
}
</style>
