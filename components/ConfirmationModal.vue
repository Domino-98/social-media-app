<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  loading: boolean;
  color?: string;
}>();

const { color = "var(--primary-color)" } = props;

const emit = defineEmits<{
  (e: "close"): void;
  (e: "action"): void;
}>();
</script>

<template>
  <BaseModal :color="color" @close="$emit('close')" :open="open">
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #body>
      <div class="body">
        <slot name="body"></slot>
      </div>

      <div class="buttons">
        <button @click.prevent="$emit('close')" class="btn btn--close">
          Zamknij
        </button>
        <button
          @click.prevent="$emit('action')"
          :disabled="loading"
          class="btn btn--confirm"
        >
          Potwierdź
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.body {
  margin: 1rem 0;
  font-size: 1.2rem;
  color: var(--font-color);
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
}

.btn {
  border-radius: 0.25rem;
  padding: 0.4rem 0.8rem;
  font-size: 1.1rem;
  transition: all 0.3s;

  &--close {
    border: 2px solid v-bind(color);
    background-color: transparent;
    color: v-bind(color);

    &:hover {
      background-color: v-bind(color);
      color: #fff;
    }
  }

  &--confirm {
    border: 2px solid v-bind(color);
    background-color: v-bind(color);
    color: #fff;

    &:hover {
      filter: brightness(125%);
    }
  }

  &:disabled {
    filter: grayscale(50%);
    cursor: not-allowed;
  }
}
</style>
