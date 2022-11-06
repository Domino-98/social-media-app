<script setup lang="ts">
import { Pin } from "~~/models/pin";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { useComments } from "~~/composables/comments";
import pinsApi from "~~/services/api_pins";

const props = defineProps<{
  pin: Pin;
}>();

const router = useRouter();
const user = useSupabaseUser();
const isOwner = ref<boolean>(false);
const { comments } = useComments();
const { $download } = useNuxtApp();
const toast = useToast();

let infoEl = ref<HTMLDivElement>();
let imgEl = ref<HTMLImageElement>();
let imgHeight = ref<number>();

const setImgHeight = () => {
  setTimeout(() => {
    imgHeight.value = imgEl.value?.clientHeight;
  }, 500);
};

let showComments = ref<boolean>(true);

let isSaved = ref<boolean>(
  user.value ? await pinsApi().isPinSaved(props.pin.id, user.value.id) : false
);

const addPinToSaved = async () => {
  if (user.value) {
    try {
      await pinsApi().addToSaved(props.pin.id, user.value.id);
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
    await pinsApi().removeFromSaved(props.pin.id, user.value.id);
    toast("Usunięto Pina z zapisanych");
    isSaved.value = false;
  } catch (error) {
    console.error(error);
  }
};

let modalOpened = ref<boolean>(false);

const confirmModalOpened = ref<boolean>(false);
const isDeleting = ref<boolean>(false);

const deletePin = async (id: number) => {
  isDeleting.value = true;
  try {
    const parts = props.pin.pin_url.split("/");
    const pinFileName = parts[parts.length - 1];
    await pinsApi().deletePin(id, pinFileName, user.value.id);
    toast("Pomyślnie usunięto Pina");
    router.push("/");
  } catch (error) {
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  isOwner.value = props.pin.author.id === user.value?.id;
});

onUpdated(() => {
  isOwner.value = props.pin.author.id === user.value?.id;
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="pin">
    <div class="pin__img-container">
      <button
        v-if="isOwner"
        @click.prevent="confirmModalOpened = !confirmModalOpened"
        content="Usuń Pina"
        v-tippy
        class="pin__delete"
      >
        <font-awesome-icon icon="fa-solid fa-trash-can" size="lg" />
      </button>
      <img
        id="img1"
        ref="imgEl"
        class="pin__img"
        :class="{ rounded: infoEl?.clientHeight > imgHeight }"
        :src="pin.pin_url"
        alt=""
        @load="setImgHeight()"
      />
    </div>
    <div class="pin__content" ref="infoEl">
      <div class="pin__btns">
        <font-awesome-icon
          @click="$download(props.pin.pin_url)"
          icon="fa-solid fa-download"
          class="pin__download"
          v-tippy="{ placement: 'top' }"
          content="Pobierz Pina"
        />

        <font-awesome-icon
          @click="modalOpened = !modalOpened"
          icon="fa-solid fa-share-nodes"
          class="pin__share"
          v-tippy="{ placement: 'top' }"
          content="Udostępnij Pina"
        />

        <div
          class="pin__likes"
          v-tippy="{ placement: 'top' }"
          content="Polub Pina"
          :style="[isOwner ? { 'pointer-events': 'none' } : '']"
        >
          <font-awesome-icon icon="fa-regular fa-heart" class="pin__like" />
          <span>5</span>
        </div>

        <button
          v-if="!isSaved && !isOwner"
          @click="addPinToSaved"
          class="pin__save"
        >
          Zapisz
        </button>
        <button
          v-else-if="isSaved && !isOwner"
          @click="removePinFromSaved"
          class="pin__save"
        >
          Zapisano
        </button>
        <NuxtLink v-else :to="`/pin/${pin.id}/edit`" class="pin__save">
          Edycja Pina
        </NuxtLink>
      </div>

      <div class="pin__info">
        <a
          v-show="!!pin.destination_url"
          :href="
            pin?.destination_url?.indexOf('://') === -1
              ? 'http://' + pin.destination_url
              : pin.destination_url
          "
          target="_blank"
          class="pin__link"
          >{{ pin.destination_url }}</a
        >
        <h1 class="pin__title">{{ pin.title }}</h1>
        <p v-show="!!pin.description" class="pin__description">
          {{ pin.description }}
        </p>
      </div>

      <div class="pin__profile">
        <NuxtLink
          :to="`/profile/${props.pin.author.profile_id}`"
          class="pin__profile-link"
        >
          <img
            class="pin__profile-avatar"
            :src="
              pin.author.avatar_url ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            "
            alt=""
          />
          <span class="pin__profile-name"
            >{{ pin.author?.username || pin.author?.full_name }}
          </span>
        </NuxtLink>
        <button v-if="!isOwner" class="pin__profile-btn">Obserwuj</button>
      </div>

      <div class="pin__comments">
        <h2 class="pin__comments-header">
          {{ comments?.length
          }}{{ comments?.length === 1 ? " komentarz" : " komentarzy" }}
        </h2>

        <font-awesome-icon
          v-if="comments?.length"
          @click="(showComments = !showComments), setImgHeight()"
          :icon="`fa-solid fa-chevron-${showComments ? 'up' : 'down'}`"
        />

        <Transition name="fade">
          <PinCommentList v-if="showComments" />
        </Transition>

        <PinCommentInput v-if="user" />
      </div>
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
      @action="deletePin(pin.id)"
    >
      <template #header>Usuń Pina</template>
      <template #body>Czy na pewno chcesz usunąć Pina?</template>
    </ConfirmationModal>
  </div>
</template>

<style lang="scss" scoped>
.pin {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  max-width: 62.5rem;
  margin-top: 0.5rem;
  border-radius: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: var(--bg-color-secondary);
  color: var(--font-color);

  @media only screen and (max-width: 37.5em) {
    flex-direction: column;
    margin-left: 2rem;
    margin-right: 2rem;
  }

  &__img {
    display: block;
    width: 100%;
    height: auto;

    &-container {
      width: 50%;

      &:hover .pin__delete {
        visibility: visible;
        opacity: 1;
      }

      @media only screen and (max-width: 37.5em) {
        width: 100%;
      }
    }
  }

  &__delete {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background-color: var(--bg-color-primary);
    cursor: pointer;
    visibility: visible;
    opacity: 1;
    transition: all 0.3s;

    & svg {
      transition: all 0.3s;
    }

    &:hover svg {
      color: #ff4040;
    }

    @media (hover: hover) {
      visibility: hidden;
      opacity: 0;
    }
  }

  &__content {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 0.5rem;
    padding: 1.5rem;

    @media only screen and (max-width: 37.5em) {
      width: 100%;
      padding: 1rem;
    }
  }

  &__info,
  &__edit {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__edit {
    & input {
      background-color: rgba(var(--opacity-color), 0.1);
      padding: 0.5rem;
      border-radius: 0.25rem;
      color: var(--font-color);
    }

    & button[type="submit"] {
      align-self: flex-end;
    }
  }

  &__btns {
    display: flex;
    justify-content: space-between;
  }

  &__likes {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  &__download,
  &__share,
  &__like {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    padding: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      background-color: var(--bg-color-primary);
      color: var(--primary-color);
    }
  }

  &__link {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
  }

  &__title {
    font-size: 2.2rem;
    font-weight: 500;
    color: var(--heading-color);
  }

  &__description {
    font-size: 0.9rem;
  }

  &__category {
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    padding-right: 2rem;
    border: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    background-color: var(--bg-color-primary);
    color: var(--font-color);
    font-size: 1rem;
    -webkit-appearance: none;
    appearance: none;
    outline: none;

    & option {
      padding: 0 0.25rem;
    }
  }

  &__profile {
    display: flex;
    align-items: center;

    &-name {
      font-weight: 500;
      color: var(--heading-color);
    }

    &-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    &-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    &-btn {
      margin-left: auto;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      background-color: var(--btn-bg);
      color: var(--btn-color);
      cursor: pointer;

      &:hover {
        background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
      }
    }
  }

  &__comments {
    margin-top: 0.5rem;

    &-header {
      display: inline-block;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--heading-color);

      & + svg {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        padding: 0.25rem;
        vertical-align: middle;
        transition: all 0.3s;
        margin-left: 0.5rem;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          background-color: var(--bg-color-primary);
          color: var(--primary-color);
        }
      }
    }
  }

  &__save {
    align-self: center;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }
}

.rounded {
  max-width: calc(100% - 1rem);
  margin: 1rem 0 1rem 1rem;
  border-radius: 1rem;
  transition: all 0.2s;

  @media only screen and (max-width: 37.5em) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
