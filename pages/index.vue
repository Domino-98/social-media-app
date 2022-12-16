<script setup lang="ts">
import { Pin } from "~~/models/pin";
import pinsApi from "~~/services/api_pins";

const route = useRoute();
const { pins } = usePins();

const pinsLoading = ref<boolean>(false);

const getPins = async (from: number, to: number) => {
  pinsLoading.value = true;
  try {
    if (route.query.search) {
      const fetchedPins = await pinsApi().searchPins(
        route.query.search as string,
        from,
        to
      );
      pins.value = fetchedPins;
    } else {
      const fetchedPins = await pinsApi().fetchPins(from, to);
      pins.value.push(...fetchedPins);
    }
  } catch (error) {
  } finally {
    pinsLoading.value = false;
  }
};

const from = ref<number>(0);
const to = ref<number>(23);
const take = ref<number>(23);
const scrolledToBottom = ref<boolean>(false);

const { checkIfScrolledBottom } = useScroll();

const handleInfiniteScroll = async (e: Event) => {
  const bottom = checkIfScrolledBottom(
    (e.target as Document).scrollingElement!
  );
  if (bottom && !scrolledToBottom.value) {
    scrolledToBottom.value = true;
    from.value = to.value + 1;
    to.value += take.value + 1;
    try {
      if (route.query.search) {
        const fetchedPins = await pinsApi().searchPins(
          route.query.search as string,
          from.value,
          to.value
        );
        pins.value.push(...(fetchedPins as Pin[]));
      } else {
        const fetchedPins = await pinsApi().fetchPins(from.value, to.value);
        pins.value.push(...(fetchedPins as Pin[]));
      }
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => (scrolledToBottom.value = false), 500);
  }
};

onMounted(async () => {
  await getPins(from.value, to.value);
  window.document.addEventListener("scroll", handleInfiniteScroll);
});

onUnmounted(() => {
  pins.value = [];
  window.document.removeEventListener("scroll", handleInfiniteScroll);
});

const searchQuery = computed(() => route.query.search);

watch(searchQuery, async () => {
  pins.value = [];
  from.value = 0;
  to.value = take.value;
  await getPins(from.value, to.value);
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="container">
    <div v-if="pins.length" class="pins">
      <TransitionGroup name="scale">
        <PinCard v-for="pin in pins" :key="pin.id" :pin="pin" />
      </TransitionGroup>
    </div>
    <span v-if="pinsLoading" class="loading-spinner"></span>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  margin: 1rem 2rem;
  text-align: center;

  @media only screen and (max-width: 62.5em) {
    margin: 1rem;
  }
}

.pins {
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

  @media only screen and (max-width: 37.5em) {
    columns: 2;
  }

  @media only screen and (max-width: 25em) {
    columns: 1;
  }
}
</style>
