<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
import pinsApi from "~~/services/api_pins";

const config = useRuntimeConfig();
const route = useRoute();

const { pins } = usePins();

let pinsLoading = ref<boolean>(false);

const getAllPins = async () => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await pinsApi().fetchAllPins();
    pins.value = fetchedPins;
  } catch (error) {
  } finally {
    pinsLoading.value = false;
  }
};

// let showModal = ref();

// function displayPinModal(route) {
//   showModal.value = route.params.id;
//   console.log(showModal.value);
//   window.history.pushState({}, null, route.path);
// }

// function hidePinModal() {
//   showModal.value = null;
//   window.history.pushState({}, null, route.path);
// }

// onBeforeRouteLeave((to, from, next) => {
//   if (to.name === "pin-id") {
//     displayPinModal(to);
//   } else {
//     next();
//   }
// });

onMounted(() => {
  getAllPins();
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="container">
    <!-- <div v-if="showModal">
      <h1>Modal</h1>
      <button @click="hidePinModal">Hide pin modal</button>
    </div> -->

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
