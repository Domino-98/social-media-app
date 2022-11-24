<script setup lang="ts">
interface Props {
  name: string;
  label: string;
  id: string;
  type: "text" | "number" | "tel" | "email" | "password";
  modelValue: string | undefined;
  placeholder?: string;
}

const props = defineProps<Props>();
console.log(props.modelValue);
</script>

<template>
  <div class="form__group">
    <label :for="id" class="form__label">{{ label }}</label>
    <VField
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :type="type"
      :name="name"
      :id="id"
      :placeholder="placeholder"
      class="form__input"
    />
    <VErrorMessage :name="name" class="error" />
  </div>
</template>

<style lang="scss" scoped>
.form {
  &__group {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 0.75rem;
    text-align: start;
  }

  &__label {
    align-self: flex-start;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    color: var(--font-color);
  }

  &__input {
    transition: all 0.3s;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    background-color: rgba(var(--opacity-color), 0.09);
    color: var(--font-color);

    &:focus {
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
