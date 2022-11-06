<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  color?: string;
}>();

const { color = "var(--primary-color)" } = props;

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <div class="modal">
    <Transition name="fade">
      <div v-if="open" class="modal__overlay" @click="close"></div>
    </Transition>
    <Transition name="pop">
      <div v-if="open" class="modal__box" role="dialog">
        <header class="modal__header">
          <slot name="header"></slot>
          <font-awesome-icon
            icon="fa-solid fa-xmark"
            class="modal__header-close"
            @click="close"
          />
        </header>

        <main class="modal__content">
          <slot name="body"></slot>
        </main>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  z-index: 100;

  &__box {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 20000;
    margin: auto;
    height: fit-content;
    width: 90%;
    max-width: 30rem;
    border-radius: 0.75rem;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    background: var(--bg-color-secondary);
    color: var(--font-color);
    transform: none;

    & h1 {
      margin: 0 0 1rem;
    }
  }

  &__overlay {
    content: "";
    position: absolute;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0.6;
    cursor: pointer;
  }

  &__header {
    width: 100%;
    padding: 0.75rem;
    background: v-bind(color);
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    color: #fff;
    font-size: 1.4rem;
    text-align: center;

    &-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      cursor: pointer;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    text-align: center;
  }
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.2s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.2s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
