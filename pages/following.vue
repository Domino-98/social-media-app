<script setup lang="ts">
import { Pin } from "~~/models/pin";
import relationsApi from "~~/services/api_relations";

const user = useSupabaseUser();
const { pins } = usePins();

const pinsLoading = ref<boolean>(false);

const getFollowingPins = async () => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await relationsApi().fetchFollowingPins(user.value!.id);
    pins.value = fetchedPins;
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
      const fetchedPins = await relationsApi().fetchFollowingPins(
        user.value!.id,
        from.value,
        to.value
      );
      pins.value.push(...(fetchedPins as Pin[]));
      setTimeout(() => (scrolledToBottom.value = false), 500);
    } catch (error) {
      console.error(error);
    }
  }
};

onMounted(async () => {
  await getFollowingPins();
  window.document.addEventListener("scroll", handleInfiniteScroll);
});

onUnmounted(() => {
  pins.value = [];
  window.document.removeEventListener("scroll", handleInfiniteScroll);
});

definePageMeta({
  layout: "navigation",
  middleware: "auth",
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

.loading-spinner {
  position: absolute;
  left: 50%;
  margin: 0 0 0 -50px;
}
</style>
