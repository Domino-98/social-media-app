<script setup lang="ts">
import { Pin } from "~~/models/pin";
import categoriesApi from "~~/services/api_categories";
import pinsApi from "~~/services/api_pins";

const route = useRoute();
const pinId = computed(() => route.params.id);

const { pin, pins } = usePins();
const { comments } = useComments();

const isLoading = ref<boolean>(false);

const getPin = async () => {
  isLoading.value = true;
  try {
    const fetchedPin = await pinsApi().fetchPinById(+pinId.value);
    pin.value = fetchedPin as Pin;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const getSimilarPins = async () => {
  isLoading.value = true;
  try {
    const fetchedPins = await categoriesApi().fetchSimilarPins(
      +pinId.value,
      pin.value!.category_id
    );
    pins.value = fetchedPins as Pin[];
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getPin();
  if (pin.value) await getSimilarPins();
  window.scrollTo(0, 0);
});

onUnmounted(() => {
  pin.value = null;
  pins.value = [];
  comments.value = [];
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <main>
    <PinDetails v-if="pin" :pin="pin" />

    <div v-if="pin && pins?.length" class="pins">
      <h2 class="pins__header">Więcej podobnych</h2>
      <div class="pins__container">
        <PinCard v-for="pin in pins" :key="pin.id" :pin="pin" />
      </div>
    </div>

    <div v-if="isLoading" class="loading-spinner"></div>

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
  padding-bottom: 1rem;

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

.loading-spinner {
  margin-top: 2rem;
}
</style>
