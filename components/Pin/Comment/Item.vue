<script setup lang="ts">
import { Comment } from "~~/models/comment";
import commentsApi from "~~/services/api_comments";
import { useToast } from "vue-toastification";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  comment: Comment;
}>();

const isOwner = computed(() => user.value?.id === props.comment.user_id);
const user = useSupabaseUser();
const toast = useToast();
const { timeFromNow } = useDateTime();

const isEditing = ref<boolean>(false);

const editComment = async (comment: string, id: number) => {
  isEditing.value = true;
  try {
    await commentsApi().editComment(comment, id);
    toast("Pomyślnie edytowano komentarz");
    editMode.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isEditing.value = false;
  }
};

const editMode = ref<boolean>(false);

const commentEl = ref();

onClickOutside(commentEl, (e: Event) => {
  if ((e.target as HTMLElement).id !== "editBtn") disableEdit();
});

const disableEdit = () => {
  editMode.value = false;
};
</script>

<template>
  <div ref="commentEl" class="comment__item">
    <NuxtLink
      :to="`/profile/${comment.author?.profile_id}`"
      style="flex-shrink: 0"
    >
      <img
        class="comment__avatar"
        :src="
          comment.author?.avatar_url ||
          'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        "
        alt=""
      />
    </NuxtLink>
    <div class="comment__info">
      <span class="comment__name">{{
        comment.author?.username || comment.author?.full_name
      }}</span>

      <p v-if="!editMode" class="comment__text">{{ comment.message }}</p>
      <form v-else class="comment__form">
        <input
          type="text"
          placeholder="Komentarz..."
          v-model="comment.message"
          class="comment__input"
        />
        <button
          @click.prevent="editComment(comment.message, comment.id)"
          :disabled="!comment.message || isEditing"
          class="comment__edit"
          id="editBtn"
        >
          Edytuj
        </button>
      </form>

      <div class="comment__footer">
        <span class="comment__date">{{ timeFromNow(comment.updated_at) }}</span>
      </div>
    </div>
    <div v-if="isOwner" class="comment__btns">
      <button
        @click.prevent="editMode = !editMode"
        v-tippy="'Edytuj'"
        class="btn btn--edit"
      >
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </button>
      <button
        @click.prevent="$emit('openModal', comment)"
        v-tippy="'Usuń'"
        class="btn btn--delete"
      >
        <font-awesome-icon icon="fa-solid fa-trash-can" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  &__item {
    display: flex;
    gap: 0.5rem;
    border-radius: 0.5rem;
    padding: 0.5rem;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(var(--opacity-color), 0.05);

      & .comment__btns {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  &__avatar {
    align-self: flex-start;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
  }

  &__info {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--heading-color);
  }

  &__text {
    font-size: 0.9rem;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__date {
    font-size: 0.75rem;
    color: var(--font-color);
    opacity: 0.7;
  }

  &__form {
    position: relative;
    display: flex;
    gap: 0.5rem;
  }

  &__input {
    width: 100%;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    background-color: rgba(var(--opacity-color), 0.09);
    font-size: 0.9rem;
    transition: all 0.3s;

    &:focus {
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
  }

  &__edit {
    padding: 0.4rem 0.8rem;
    border-radius: 1rem;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 0.9rem;
    cursor: pointer;

    &:disabled {
      filter: grayscale(50%);
      cursor: not-allowed;
    }

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }

  &__btns {
    display: flex;
    gap: 0.75rem;
    margin-left: auto;
    transition: all 0.3s;

    @media only screen and (max-width: 37.5em) {
      flex-direction: column;
      align-self: center;
    }

    @media (hover: hover) {
      visibility: hidden;
      opacity: 0;
    }

    & svg {
      font-size: 1.2rem;
      transition: all 0.3s;
    }
  }
}

.btn {
  align-self: center;
  color: var(--icon-color);
  cursor: pointer;
  padding: 0;

  &--edit {
    &:hover svg {
      color: var(--primary-color);
    }
  }

  &--delete {
    &:hover svg {
      color: hsl(0, 100%, 62%);
    }
  }
}
</style>
