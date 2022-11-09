<script setup lang="ts">
import categoriesApi from "~~/services/api_categories";

const { pins } = usePins();

let pinsLoading = ref<boolean>(false);

const route = useRoute();
const slug = route.params.slug;

const getAllPins = async () => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await categoriesApi().fetchPinsByCategory(
      slug as string
    );
    pins.value = fetchedPins;
  } catch (error) {
  } finally {
    pinsLoading.value = false;
  }
};

onMounted(async () => {
  await getAllPins();
});

onUnmounted(() => {
  pins.value = [];
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="container">
    <TransitionGroup name="scale">
      <PinCard v-for="pin in pins" :key="pin.id" :pin="pin" />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 1rem 2rem;
  columns: 5;
  column-gap: 1.5rem;
  font-size: 1.2rem;

  @media only screen and (max-width: 87.5em) {
    columns: 4;
  }

  @media only screen and (max-width: 75em) {
    columns: 3;
    column-gap: 1rem;
  }

  @media only screen and (max-width: 50em) {
    margin: 1rem;
  }

  @media only screen and (max-width: 37.5em) {
    columns: 2;
  }

  @media only screen and (max-width: 25em) {
    columns: 1;
  }
}
</style>
