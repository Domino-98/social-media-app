<script setup lang="ts">
import pinsApi from "~~/services/api_pins";
import { Pin } from "~~/models/pin";

const props = defineProps<{
  userId: string;
}>();

const { userPins, savedPins } = usePins();

type PinTab = "created" | "saved";

const activeTab = ref<PinTab>("created");

const changePinTab = async (tab: PinTab) => {
  activeTab.value = tab;
  from.value = 0;
  to.value = take.value;
  tab === "created"
    ? await getUserPins(props.userId)
    : await getSavedPins(props.userId);
};

const pinsLoading = ref<boolean>(false);

const getUserPins = async (userId: string) => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await pinsApi().fetchUserPins(
      userId,
      from.value,
      to.value
    );
    userPins.value = fetchedPins as Pin[];
  } catch (error) {
    console.error(error);
  } finally {
    pinsLoading.value = false;
  }
};

const getSavedPins = async (userId: string) => {
  pinsLoading.value = true;
  try {
    const fetchedPins = await pinsApi().fetchSavedPins(
      userId,
      from.value,
      to.value
    );
    savedPins.value = fetchedPins as Pin[];
  } catch (error) {
    console.error(error);
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
      if (activeTab.value === "created") {
        const fetchedPins = await pinsApi().fetchUserPins(
          props.userId,
          from.value,
          to.value
        );
        userPins.value.push(...(fetchedPins as Pin[]));
      } else {
        const fetchedPins = await pinsApi().fetchSavedPins(
          props.userId,
          from.value,
          to.value
        );
        savedPins.value.push(...(fetchedPins as Pin[]));
      }
      setTimeout(() => (scrolledToBottom.value = false), 500);
    } catch (error) {
      console.error(error);
    }
  }
};

onMounted(async () => {
  await getUserPins(props.userId);
  window.document.addEventListener("scroll", handleInfiniteScroll);
});

onUnmounted(() => {
  window.document.removeEventListener("scroll", handleInfiniteScroll);
  userPins.value = [];
  savedPins.value = [];
});
</script>

<template>
  <div class="pins">
    <div class="pins__btns">
      <button
        @click="changePinTab('created')"
        :class="{ active: activeTab === 'created' }"
        class="pins__btn"
      >
        Utworzone
      </button>
      <button
        @click="changePinTab('saved')"
        :class="{ active: activeTab === 'saved' }"
        class="pins__btn"
      >
        Zapisane
      </button>
    </div>

    <div v-if="userPins.length || savedPins.length" class="pins__container">
      <PinCard
        v-if="activeTab === 'created'"
        v-for="pin in userPins"
        :key="pin.id"
        :pin="pin"
      />

      <PinCard
        v-if="activeTab === 'saved'"
        v-for="pin in savedPins"
        :key="pin.id"
        :pin="pin"
      />
    </div>

    <span v-if="pinsLoading" class="loading-spinner"></span>
  </div>
</template>

<style lang="scss" scoped>
.pins {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__btns {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  &__btn {
    padding: 0.75rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    cursor: pointer;

    &:not(.active) {
      color: var(--font-color);
    }

    &:not(.active):hover {
      background-color: rgba(var(--opacity-color), 0.1);
    }
  }

  &__container {
    margin: 2rem auto;
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
}

.active {
  padding: 0.75rem;
  border-radius: 2rem;
  background-color: var(--primary-color);
  color: #eee;
}
</style>
