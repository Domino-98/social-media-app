<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();

onMounted(() => {
  window.scrollTo(0, 0);
});

const id = route.params.id;
const image = ref();

const URL = `https://api.unsplash.com/photos/${id}?client_id=${config.UNSPLASH_API_KEY}`;

async function getImage() {
  const data = await fetch(URL);
  const json = await data.json();
  image.value = json;
}

getImage();

// Fetch images
const { data: images } = useAsyncData("similarImages", async () => {
  let response: any;
  try {
    response = $fetch(`https://api.unsplash.com/photos/random`, {
      params: {
        count: 20,
        client_id: config.UNSPLASH_API_KEY,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return response;
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <main>
    <PinDetails v-if="image" :image="image" />

    <div class="pins">
      <h2 class="pins__header">Więcej podobnych</h2>
      <div class="pins__container">
        <PinCard v-for="image in images" :key="image.id" :image="image" />
      </div>
    </div>
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
