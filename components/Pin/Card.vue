<script setup lang="ts">
import { Pin } from "~~/models/pin";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import pinsApi from "~~/services/api_pins";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  pin: Pin;
}>();

const { pins } = usePins();
const user = useSupabaseUser();
const isOwner = ref<boolean>(false);
const { $download } = useNuxtApp();
const toast = useToast();

const isSaved = ref<boolean>(
  user.value ? await pinsApi().isPinSaved(props.pin.id, user.value.id) : false
);

const userProfile = useUser();

const addPinToSaved = async () => {
  if (user.value) {
    try {
      await pinsApi().addToSaved(
        props.pin.id,
        user.value.id,
        props.pin.author?.id!,
        userProfile.value!,
        props.pin
      );
      toast("Dodano Pina do zapisanych");
      isSaved.value = true;
    } catch (error) {
      console.error(error);
    }
  } else {
    toast("Zaloguj się, by dodać Pina do zapisanych", { type: TYPE.ERROR });
  }
};

const removePinFromSaved = async () => {
  try {
    await pinsApi().removeFromSaved(props.pin.id, user.value!.id);
    toast("Usunięto Pina z zapisanych");
    isSaved.value = false;
  } catch (error) {
    console.error(error);
  }
};

const confirmModalOpened = ref<boolean>(false);
const isDeleting = ref<boolean>(false);

const deletePin = async (id: number) => {
  isDeleting.value = true;
  try {
    const parts = props.pin.pin_url.split("/");
    const pinFileName = parts[parts.length - 1];
    await pinsApi().deletePin(id, pinFileName, user.value!.id);
    const pinIndex = pins.value.findIndex((pin) => pin.id === props.pin.id);
    pins.value.splice(pinIndex, 1);
    toast("Pomyślnie usunięto Pina");
  } catch (error) {
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};

const optionsExpanded = ref<boolean>(false);

const toggleOptions = () => {
  optionsExpanded.value = !optionsExpanded.value;
};

const modalOpened = ref<boolean>(false);

const optionsEl = ref();

onClickOutside(optionsEl, (e: Event) => {
  if ((e.target as HTMLElement).id !== `optionsBtn-${props.pin.id}`)
    toggleOptions();
});

onMounted(() => {
  isOwner.value = props.pin.author?.id === user.value?.id;
});

watch(
  () => user?.value?.id,
  async () => {
    isOwner.value = props.pin.author?.id === user.value?.id;
  },
  { deep: true }
);
</script>

<template>
  <div class="pin">
    <div class="pin__container">
      <NuxtLink
        class="pin__link"
        :to="{
          name: 'pin-id',
          params: { id: pin.id },
        }"
      >
        <img
          :style="[optionsExpanded ? { filter: 'brightness(60%)' } : '']"
          class="pin__img"
          :src="pin.pin_url"
        />
      </NuxtLink>
      <div
        :style="[optionsExpanded ? { display: 'block' } : '']"
        class="pin__btns"
      >
        <button
          v-if="!isSaved && !isOwner"
          @click.prevent="addPinToSaved"
          class="pin__save"
        >
          Zapisz
        </button>
        <button
          v-if="isSaved && !isOwner"
          @click.prevent="removePinFromSaved"
          class="pin__save"
        >
          Zapisano
        </button>
        <button
          @click.prevent="toggleOptions"
          :style="[optionsExpanded ? { display: 'flex' } : '']"
          class="pin__more"
          :id="`optionsBtn-${pin.id}`"
        >
          <font-awesome-icon
            icon="fa-solid fa-ellipsis"
            class="icon icon--more"
          />
        </button>
        <NuxtLink
          v-if="pin.destination_url"
          @click.stop
          :to="
            pin?.destination_url.indexOf('://') === -1
              ? 'http://' + pin.destination_url
              : pin.destination_url
          "
          target="_blank"
        >
          <button class="pin__destination">
            <font-awesome-icon icon="fa-solid fa-share" />
            <span>{{ pin.destination_url }}</span>
          </button>
        </NuxtLink>
      </div>
    </div>

    <Transition name="scale">
      <ul v-if="optionsExpanded" ref="optionsEl" class="pin__options">
        <li @click="$download(pin.pin_url)" class="pin__options-item">
          <font-awesome-icon icon="fa-solid fa-download" size="lg" />Pobierz
        </li>
        <li @click="modalOpened = !modalOpened" class="pin__options-item">
          <font-awesome-icon
            icon="fa-solid fa-share-nodes"
            size="lg"
          />Udostępnij
        </li>
        <li
          v-if="!isSaved && !isOwner"
          @click.prevent="
            addPinToSaved();
            toggleOptions();
          "
          class="pin__options-item pin__options-item--save"
        >
          <font-awesome-icon icon="fa-regular fa-heart" />Zapisz
        </li>
        <li
          v-if="isSaved && !isOwner"
          @click.prevent="
            removePinFromSaved();
            toggleOptions();
          "
          class="pin__options-item pin__options-item--save"
        >
          <font-awesome-icon icon="fa-solid fa-heart" />Zapisano
        </li>
        <li
          v-if="isOwner"
          @click.prevent="confirmModalOpened = !confirmModalOpened"
          class="pin__options-item"
        >
          <font-awesome-icon icon="fa-solid fa-trash-can" size="lg" />Usuń
        </li>
      </ul>
    </Transition>

    <div class="pin__profile">
      <NuxtLink :to="`/profile/${pin.author?.profile_id}`">
        <img
          class="pin__profile-img"
          :src="
            pin.author?.avatar_url ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          alt="Profile page"
        />
        <p class="pin__profile-name">
          {{ pin?.author?.username || pin?.author?.full_name }}
        </p>
      </NuxtLink>
    </div>

    <BaseModal :open="modalOpened" @close="modalOpened = false">
      <template #header>Udostępnij Pina</template>
      <template #body>
        <PinShare :pin="pin" />
      </template>
    </BaseModal>

    <ConfirmationModal
      :open="confirmModalOpened"
      :loading="isDeleting"
      :color="'hsl(0, 100%, 62%)'"
      @close="confirmModalOpened = false"
      @action="deletePin(props.pin.id)"
    >
      <template #header>Usuń Pina</template>
      <template #body>Czy na pewno chcesz usunąć Pina?</template>
    </ConfirmationModal>
  </div>
</template>

<style lang="scss" scoped>
.pin {
  position: relative;
  width: 100%;
  margin: 0 0 1rem;
  break-inside: avoid;

  &__btns {
    display: none;

    @media only screen and (max-width: 50em) {
      display: block;
    }
  }

  &__container {
    position: relative;
    display: block;

    &:hover .pin__btns {
      display: block;
    }

    &:hover .pin__img {
      filter: brightness(60%);

      @media only screen and (max-width: 50em) {
        filter: unset;
      }
    }
  }

  &__save {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background-color: var(--primary-color);
    color: #eee;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    opacity: 0.8;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }

    @media only screen and (max-width: 50em) {
      display: none;
    }
  }

  &__more,
  &__destination {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background-color: var(--bg-color-secondary);
    color: var(--font-color);
    cursor: pointer;
    opacity: 0.8;

    &:hover svg {
      color: var(--primary-color);
    }

    @media only screen and (max-width: 50em) {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  &__destination {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    width: 6.5rem;
    border-radius: 1rem;
    padding: 0 0.5rem;
    font-size: 0.9rem;
    color: var(--font-color);

    & span {
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &__more {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
      rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
    bottom: 0.75rem;
    right: 0.5rem;

    @media only screen and (max-width: 50em) {
      bottom: -2.5rem;
    }
  }

  &__destination {
    bottom: 0.75rem;
    left: 0.5rem;
  }

  &__img {
    width: 100%;
    border-radius: 0.75rem;
    cursor: pointer;
  }

  &__profile {
    display: flex;

    @media only screen and (max-width: 50em) {
      width: 60%;
    }

    & a {
      display: flex;
      align-items: center;
      margin-top: 0.25rem;
      cursor: pointer;
    }

    &-img {
      width: 1.75rem;
      margin-right: 0.5rem;
      border-radius: 50%;
      cursor: pointer;
    }

    &-name {
      color: var(--font-color);
      font-size: 0.7rem;
      font-weight: 500;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &__options {
    z-index: 10;
    position: absolute;
    right: 0;
    min-width: 10rem;
    background-color: var(--bg-color-secondary);
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

    @media only screen and (max-width: 50em) {
      bottom: 2rem;
    }

    &-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      cursor: pointer;
      font-size: 1rem;
      color: var(--font-color);

      &:hover {
        background-color: rgba(var(--opacity-color), 0.1);
      }

      &--save {
        display: none;

        @media only screen and (max-width: 50em) {
          display: flex;
        }
      }
    }
  }
}

.icon {
  &--more {
    pointer-events: none;
  }
}
</style>
