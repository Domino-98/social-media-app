<script setup lang="ts">
interface Props {
  name: string;
  label: string;
  id: string;
  modelValue: string | undefined;
  placeholder?: string;
}

const props = defineProps<Props>();

console.log(props.modelValue);
</script>

<template>
  <div class="form__group">
    <label for="bio" class="form__label">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :name="name"
      class="form__input"
      :id="id"
      cols="20"
      rows="3"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<style lang="scss" scoped>
.form {
  &__group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 1rem;
  }

  &__label {
    font-size: 0.9rem;
    color: var(--font-color);
  }

  &__input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    background-color: rgba(var(--opacity-color), 0.09);
    color: var(--font-color);
    transition: all 0.3s;

    &:focus {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
