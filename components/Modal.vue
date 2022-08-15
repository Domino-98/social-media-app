<script setup lang="ts">
const props = defineProps({
  open: { type: Boolean, required: true },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div class="modal">
      <Transition name="fade">
        <div v-if="open" class="modal__overlay" @click="close"></div>
      </Transition>
      <Transition name="pop">
        <div v-if="open" class="modal__box" role="dialog">
          <div class="modal__header">
            <slot name="header">Modal title</slot>
            <font-awesome-icon
              icon="fa-solid fa-xmark"
              class="modal__header-close"
              @click="close"
            />
          </div>

          <div class="modal__content">
            <slot name="body">Modal body</slot>
            <slot name="button">
              <button class="modal__btn" @click="close">Zamknij</button>
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  &__box {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 20000;

    margin: auto;
    text-align: center;
    width: fit-content;
    height: fit-content;
    width: 90%;
    max-width: 30em;
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

  &__btn {
    align-self: flex-end;
    border: 2px solid var(--primary-color);
    border-radius: 0.25rem;
    padding: 0.4rem 1.2rem;
    background-color: var(--primary-color);
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: transparent;
      color: var(--primary-color);
    }
  }

  &__header {
    width: 100%;
    padding: 0.75rem;
    background: var(--primary-color);
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    color: #fff;
    font-size: 1.4rem;

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
    padding: 1rem;
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
