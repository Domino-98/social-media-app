<script setup lang="ts">
import { Pin } from "~~/models/pin";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";

const props = defineProps<{
  pin: Pin;
}>();

const user = useSupabaseUser();
const isOwner = props.pin.author.id === user.value?.id;
const { addToSaved, removeFromSaved, isPinSaved } = usePins();
const toast = useToast();

let isSaved = ref<boolean>(
  user.value ? await isPinSaved(props.pin.id, user.value.id) : false
);

const addPinToSaved = async () => {
  if (user.value) {
    try {
      await addToSaved(props.pin.id, user.value.id);
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
    await removeFromSaved(props.pin.id, user.value.id);
    toast("Usunięto Pina z zapisanych");
    isSaved.value = false;
  } catch (error) {
    console.error(error);
  }
};

let optionsExpanded = ref<boolean>(false);

const toggleOptions = () => {
  optionsExpanded.value = !optionsExpanded.value;
};
</script>

<template>
  <div class="photo">
    <div class="photo__container">
      <NuxtLink
        class="photo__link"
        :to="{
          name: 'pin-id',
          params: { id: pin.id },
        }"
      >
        <img
          :style="[optionsExpanded ? { filter: 'brightness(60%)' } : '']"
          class="photo__img"
          :src="pin.pin_url"
        />
      </NuxtLink>
      <div :style="[optionsExpanded ? { display: 'block' } : '']" class="photo__btns">
        <button v-if="!isSaved" @click.prevent="addPinToSaved" class="photo__save">
          Zapisz
        </button>
        <button v-else @click.prevent="removePinFromSaved" class="photo__save">
          Zapisano
        </button>
        <button class="photo__like">
          <span class="material-icons md-24">favorite_border</span>
        </button>
        <button
          @click.prevent="toggleOptions"
          :style="[optionsExpanded ? { display: 'flex' } : '']"
          class="photo__more"
        >
          <span class="material-icons md-24">more_horiz</span>
        </button>
        <button v-if="pin.destination_url" class="photo__destination">
          <span class="material-icons-outlined md-18">shortcut</span>
          <NuxtLink @click.stop="" :to="pin.destination_url" target="_blank"
            >{{ pin.destination_url.substring(0, 12) }}...</NuxtLink
          >
        </button>
      </div>
    </div>

    <Transition name="scale">
      <ul v-if="optionsExpanded" v-click-outside="toggleOptions" class="options">
        <li class="options__item">
          <span class="material-icons-outlined md-24">file_download</span>Pobierz
        </li>
        <li class="options__item">
          <span class="material-icons-outlined md-24">share</span>Udostępnij
        </li>
        <li v-if="isOwner" class="options__item">
          <span class="material-icons-outlined md-24">delete</span>Usuń
        </li>
      </ul>
    </Transition>

    <NuxtLink :to="`/profile/${pin.author.profile_id}`" class="photo__profile">
      <img class="photo__profile-img" :src="pin.author.avatar_url" alt="Profile page" />
      <p class="photo__profile-name">
        {{ pin?.author?.username || pin?.author?.full_name }}
      </p>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.photo {
  position: relative;
  width: 100%;
  margin: 0 0 1rem;
  break-inside: avoid;

  &__btns {
    display: none;
  }

  &__container {
    position: relative;
    display: block;

    &:hover .photo__btns {
      display: block;
    }

    &:hover .photo__img {
      filter: brightness(60%);
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

    @media only screen and (max-width: 37.5em) {
      padding: 0.75rem 1.5rem;
    }
  }

  &__like,
  &__more,
  &__destination {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background-color: var(--bg-color-primary);
    color: #252525;
    cursor: pointer;

    opacity: 0.8;

    &:hover span {
      color: var(--primary-color);
    }

    @media only screen and (max-width: 37.5em) {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  &__destination {
    border-radius: 1rem;
    width: unset;
    font-size: 0.9rem;
    gap: 0.25rem;
    padding: 0 0.5rem;
    color: var(--font-color);
  }

  &__like {
    top: 0.5rem;
    left: 0.5rem;
  }

  &__more {
    bottom: 0.75rem;
    right: 0.5rem;
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
    align-items: center;
    margin-top: 0.25rem;
    cursor: pointer;

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
    }
  }
}

.options {
  position: absolute;
  right: 0;
  min-width: 10rem;
  background-color: var(--bg-color-secondary);
  overflow: hidden;
  border-radius: 1rem;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    color: var(--font-color);

    &:hover {
      background-color: rgba(var(--opacity-color), 0.1);
    }
  }
}
</style>
