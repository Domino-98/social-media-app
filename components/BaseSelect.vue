<script setup lang="ts">
interface Props {
  label: string;
  name: string;
  id: string;
  modelValue?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="form__group">
    <label for="" class="form__label">{{ label }}</label>
    <VField
      :value="modelValue"
      :name="name"
      :id="id"
      as="select"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      :validateOnBlur="false"
      class="form__select"
    >
      <slot name="options"></slot>
    </VField>
    <font-awesome-icon icon="fa-solid fa-chevron-down" />
  </div>
  <VErrorMessage :name="name" class="error" />
</template>

<style lang="scss" scoped>
.form {
  &__group {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    text-align: left;

    & svg {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      pointer-events: none;
    }
  }

  &__label {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--font-color);
  }

  &__select {
    position: relative;
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: none;
    box-shadow: 0 1px 0 rgba(var(--opacity-color), 0.2);
    color: var(--font-color);
    font-size: 1rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
  }
}
</style>
