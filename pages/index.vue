<script setup lang="ts">
import { Pin } from "~~/models/pin";
import pinsApi from "~~/services/api_pins";

const route = useRoute();
const { pins } = usePins();

const pinsLoading = ref<boolean>(false);

const getAllPins = async () => {
  pinsLoading.value = true;
  try {
    if (route.query.search) {
      const fetchedPins = await pinsApi().searchPins(
        route.query.search as string
      );
      pins.value = fetchedPins as Pin[];
      return;
    }
    const fetchedPins = await pinsApi().fetchAllPins();
    pins.value = fetchedPins as Pin[];
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

const searchQuery = computed(() => route.query.search);

watch(searchQuery, async () => {
  await getAllPins();
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="container">
    <PinCard v-if="pins.length" v-for="pin in pins" :key="pin.id" :pin="pin" />

    <span v-if="pinsLoading" class="loading-spinner"></span>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 1rem 2rem;
  columns: 5;
  column-gap: 1.5rem;
  font-size: 1.2rem;
  min-height: 100vh;

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

.loading-spinner {
  position: absolute;
  left: 50%;
  margin: 0 0 0 -50px;
}
</style>
