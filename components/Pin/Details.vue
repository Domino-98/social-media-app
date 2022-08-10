<script setup lang="ts">
import { Pin } from "~~/models/pin";
import { Comment } from "~~/models/comment";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";

const props = defineProps<{
  pin: Pin;
}>();

const client = useSupabaseClient();
const user = useSupabaseUser();
const { addToSaved, removeFromSaved, isPinSaved } = usePins();
const toast = useToast();

let infoEl = ref<HTMLDivElement>();
let imgEl = ref<HTMLImageElement>();
let imgHeight = ref<number>();

const setImgHeight = () => {
  setTimeout(() => {
    imgHeight.value = imgEl.value?.clientHeight;
  }, 100);
};

let comment = ref<Comment>();
let comments = ref<Comment[]>([]);
let showComments = ref<boolean>(true);
let isLoading = ref<boolean>();

const getComments = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await client
      .from<Comment>("comments")
      .select(
        `
    *,
    author:profiles (
      profile_id,
      avatar_url,
      username,
      full_name
    )
  `
      )
      .match({ pin_id: props.pin.id });

    console.log(data);
    comments.value = data;
    console.log(client.auth.user());
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const addComment = async () => {
  if (comment.value) {
    const { data, error } = await client.from("comments").insert({
      message: comment.value,
      pin_id: props.pin.id,
      user_id: client.auth.user().id,
    });

    if (error) throw error;

    console.log(data);
    comments.value.push({
      ...data[0],
      author: {
        user_id: client.auth.user().id,
        avatar_url: client.auth.user().user_metadata.avatar_to_display,
        username:
          client.auth.user().user_metadata.username ||
          client.auth.user().user_metadata.full_name,
      },
    });
    comment.value = null;
  }
};

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

onMounted(() => {
  getComments();
});

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="pin">
    <img
      id="img1"
      ref="imgEl"
      class="pin__img"
      :class="{ rounded: infoEl?.clientHeight > imgHeight }"
      :src="pin.pin_url"
      alt=""
      @load="setImgHeight()"
    />
    <div class="pin__info" ref="infoEl">
      <div class="pin__btns">
        <span class="material-icons md-24 pin__download">file_download</span>
        <span class="material-icons md-24 pin__share">ios_share</span>
        <div class="pin__likes">
          <span class="material-icons md-24 pin__like">favorite_border</span>
          <span>5</span>
        </div>

        <button v-if="!isSaved" @click="addPinToSaved" class="pin__save">Zapisz</button>
        <button v-else @click="removePinFromSaved" class="pin__save">Zapisano</button>
      </div>
      <a href="#" class="pin__link">{{ pin.destination_url }}</a>
      <h1 class="pin__title">{{ pin.title }}</h1>
      <p class="pin__description">
        {{ pin.description }}
      </p>
      <NuxtLink :to="`/profile/${props.pin.author.profile_id}`" class="pin__profile">
        <img class="pin__profile-avatar" :src="pin.author.avatar_url" alt="" />
        <span class="pin__profile-name">{{
          pin.author?.username || pin.author?.full_name
        }}</span>
        <div class="pin__profile-follow">Obserwuj</div>
      </NuxtLink>
      <div class="pin__comments">
        <h2 class="pin__comments-header">
          {{ comments.length }}{{ comments.length === 1 ? " komentarz" : " komentarzy" }}
        </h2>
        <span
          v-if="comments.length"
          @click="(showComments = !showComments), setImgHeight()"
          class="material-icons-outlined md-30"
        >
          {{ showComments ? "expand_less" : "expand_more" }}
        </span>
        <div v-if="showComments && comments.length" class="pin__comments-list">
          <div v-for="comment in comments" :key="comment.id" class="pin__comments-item">
            <img class="pin__comments-avatar" :src="comment.author.avatar_url" alt="" />
            <div class="pin__comments-info">
              <span class="pin__comments-name">{{
                comment.author.username || comment.author.full_name
              }}</span>
              <p class="pin__comments-text">{{ comment.message }}</p>
            </div>
          </div>
        </div>
        <div class="pin__comments-add">
          <img
            class="pin__comments-avatar pin__comments-avatar"
            :src="pin.author.avatar_url"
            alt=""
          />
          <input
            @keyup.enter="addComment"
            v-model="comment"
            class="pin__comments-input"
            placeholder="Dodaj komentarz"
          />
          <button @click="addComment" class="pin__comments-btn" :disabled="!comment">
            <span class="material-icons-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
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
    align-self: flex-start;
    display: block;
    width: 50%;

    @media only screen and (max-width: 37.5em) {
      width: 100%;
    }
  }

  &__info {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    width: 50%;
    gap: 0.5rem;
    padding: 1.5rem;

    @media only screen and (max-width: 37.5em) {
      width: 100%;
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
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.25rem;
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
  }

  &__title {
    font-size: 2.2rem;
    font-weight: 500;
    color: var(--heading-color);
  }

  &__description {
    font-size: 0.9rem;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &-name {
      font-weight: 500;
      color: var(--heading-color);
    }

    &-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    &-follow {
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

      & + span {
        display: inline-block;
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

    &-item {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    &-avatar {
      align-self: flex-start;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }

    &-info {
      align-self: flex-start;
    }

    &-name {
      font-weight: 500;
      color: var(--heading-color);
    }

    &-text {
      font-size: 0.9rem;
    }

    &-add {
      display: flex;
      align-items: center;
      gap: 1rem;

      margin-top: 1rem;
    }

    &-input {
      width: 100%;
      background-color: var(--bg-color-primary);
      padding: 0.5rem;
      border-radius: 1rem;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
      font-size: 0.9rem;
    }

    &-btn span {
      transition: all 0.3s;
      cursor: pointer;
    }

    &-btn:hover span {
      color: var(--primary-color);
    }

    &-btn:disabled span {
      color: #a3a3a3;
      cursor: not-allowed;
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
  max-width: calc(50% - 1rem);
  margin: 1rem 0 1rem 1rem;
  border-radius: 1rem;

  @media only screen and (max-width: 37.5em) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
