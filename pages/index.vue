<script setup lang="ts">
import { onBeforeRouteLeave } from "vue-router";
import { Pin } from "~~/models/pin";

const config = useRuntimeConfig();
const route = useRoute();
const client = useSupabaseClient();

const isLoading = ref<boolean>();

const { fetchAllPins, pins, pinsLoading } = usePins();

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
  fetchAllPins();
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

    <PinCard v-for="pin in pins" :key="pin.id" :pin="pin" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: auto;
  margin: 1rem 2rem;
  columns: 5;
  column-gap: 1rem;
  font-size: 1.2rem;

  @media only screen and (max-width: 87.5em) {
    columns: 4;
  }

  @media only screen and (max-width: 75em) {
    columns: 3;
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
