<script setup lang="ts">
import pinsApi from "~~/services/api_pins";

const route = useRoute();
const pinId = computed(() => route.params.id);

const { pin } = usePins();

let isLoading = ref<boolean>(false);

const fetchPin = async () => {
  isLoading.value = true;
  try {
    const fetchedPin = await pinsApi().fetchPinById(+pinId.value);
    pin.value = fetchedPin;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPin();
  window.scrollTo(0, 0);
});

onBeforeMount(() => {
  pin.value = null;
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <main>
    <PinDetails v-if="pin" :pin="pin" />

    <div class="pins">
      <h2 class="pins__header">Więcej podobnych</h2>
      <div class="pins__container">
        <!-- <PinCard v-for="image in images" :key="image.id" :image="image" /> -->
      </div>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 2rem;

  @media only screen and (max-width: 50em) {
    margin: 0 1rem;
  }
}
.pins {
  margin-top: 2rem;

  &__header {
    text-align: center;
    font-weight: 500;
    font-size: 1.4rem;
    color: var(--heading-color);
  }

  &__container {
    margin: 2rem 0;
    columns: 5;
    column-gap: 1rem;
    font-size: 1.2rem;

    @media only screen and (max-width: 87.5em) {
      columns: 4;
    }

    @media only screen and (max-width: 75em) {
      columns: 3;
    }

    @media only screen and (max-width: 37.5em) {
      columns: 2;
    }

    @media only screen and (max-width: 25em) {
      columns: 1;
    }
  }
}
</style>
