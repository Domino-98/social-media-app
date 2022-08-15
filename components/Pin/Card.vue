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
const { $download } = useNuxtApp();
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

let modalOpened = ref<boolean>(false);
let homeURL = window.location.origin;
let copyInput = ref<HTMLInputElement>();
let copied = ref<boolean>(false);

const copyURL = () => {
  copyInput.value.select();
  copyInput.value.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyInput.value.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
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
          <font-awesome-icon icon="fa-regular fa-heart" />
        </button>
        <button
          @click.prevent="toggleOptions"
          :style="[optionsExpanded ? { display: 'flex' } : '']"
          class="photo__more"
        >
          <font-awesome-icon icon="fa-solid fa-ellipsis" />
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
          <button class="photo__destination">
            <font-awesome-icon icon="fa-solid fa-share" />
            <span>{{ pin.destination_url }}</span>
          </button>
        </NuxtLink>
      </div>
    </div>

    <Transition name="scale">
      <ul v-if="optionsExpanded" v-click-outside="toggleOptions" class="options">
        <li @click="$download(pin.pin_url)" class="options__item">
          <font-awesome-icon icon="fa-solid fa-download" size="lg" />Pobierz
        </li>
        <li @click="modalOpened = !modalOpened" class="options__item">
          <font-awesome-icon icon="fa-solid fa-share-nodes" size="lg" />Udostępnij
        </li>
        <li v-if="isOwner" class="options__item">
          <font-awesome-icon icon="fa-solid fa-trash-can" size="lg" />Usuń
        </li>
      </ul>
    </Transition>

    <NuxtLink :to="`/profile/${pin.author.profile_id}`" class="photo__profile">
      <img class="photo__profile-img" :src="pin.author.avatar_url" alt="Profile page" />
      <p class="photo__profile-name">
        {{ pin?.author?.username || pin?.author?.full_name }}
      </p>
    </NuxtLink>

    <Modal :open="modalOpened" @close="modalOpened = false">
      <template v-slot:header> Udostępnij Pina </template>
      <template v-slot:body>
        <tippy
          @click="copyURL"
          class="copy"
          placement="right"
          content="Skopiuj"
          delay="0"
          zIndex="99999"
          hideOnClick="false"
        >
          <input
            ref="copyInput"
            class="copy__input"
            type="text"
            :value="`${homeURL}/pin/${pin.id}`"
            disabled
          />
          <font-awesome-icon icon="fa-solid fa-copy" size="xl" class="copy__icon" />
        </tippy>

        <p v-if="copied" class="copied">Skopiowano!</p>

        <div class="share">
          <ShareNetwork
            class="share__fb"
            network="facebook"
            :url="`${homeURL}/pin/${pin.id}`"
            :title="pin.title"
            description="Hej, popatrz na ten obrazek!"
            hashtags="graphics"
          >
            <font-awesome-icon
              icon="fa-brands fa-facebook-square"
              :style="{ color: 'white' }"
              size="xl"
            />
            <span>Facebook</span>
          </ShareNetwork>

          <ShareNetwork
            class="share__twitter"
            network="twitter"
            :url="`${homeURL}/pin/${pin.id}`"
            :title="pin.title"
            description="Hej, popatrz na ten obrazek!"
            hashtags="graphics"
          >
            <font-awesome-icon
              icon="fa-brands fa-twitter"
              :style="{ color: 'white' }"
              size="xl"
            />
            <span>Twitter</span>
          </ShareNetwork>

          <ShareNetwork
            class="share__whatsapp"
            network="whatsapp"
            :url="`${homeURL}/pin/${pin.id}`"
            :title="pin.title"
            description="Hej, popatrz na ten obrazek!"
            hashtags="graphics"
          >
            <font-awesome-icon
              icon="fa-brands fa-whatsapp"
              :style="{ color: 'white' }"
              size="xl"
            />
            <span>WhatsApp</span>
          </ShareNetwork>
        </div>
      </template>
    </Modal>
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
    color: var(--font-color);
    cursor: pointer;

    opacity: 0.8;

    &:hover svg {
      color: var(--primary-color);
    }

    @media only screen and (max-width: 37.5em) {
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
