<script setup lang="ts">
import commentsApi from "~~/services/api_comments";
import { useToast } from "vue-toastification";
import type { Comment } from "~~/models/comment";

const pinId = computed(() => route.params.id);
const { comments } = useComments();
const route = useRoute();
const toast = useToast();

const isLoading = ref<boolean>(false);
const loadedAll = ref<boolean>(true);

const getComments = async (from: number, to: number) => {
  isLoading.value = true;
  try {
    const { fetchedComments, nextComments } = await commentsApi().fetchComments(
      +pinId.value,
      from,
      to
    );
    comments.value = fetchedComments as Comment[];
    if (nextComments.length) {
      loadedAll.value = false;
    } else {
      loadedAll.value = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const from = ref<number>(0);
const to = ref<number>(2);
const take = ref<number>(2);

const loadMore = async () => {
  if (!loadedAll.value)
    try {
      from.value = to.value + 1;
      to.value += take.value + 1;
      const { fetchedComments, nextComments } =
        await commentsApi().fetchComments(
          +pinId.value,
          from.value,
          to.value,
          take.value
        );
      comments.value.push(...(fetchedComments as Comment[]));
      if (!nextComments.length) {
        loadedAll.value = true;
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
};

const confirmModalOpened = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const commentToDelete = ref<Comment>();

const openModal = (comment: Comment) => {
  confirmModalOpened.value = true;
  commentToDelete.value = comment;
};

const deleteComment = async (id: number) => {
  isDeleting.value = true;
  try {
    await commentsApi().deleteComment(id);
    const commentIndex = comments.value.findIndex((pin) => pin.id === id);
    comments.value.splice(commentIndex, 1);
    toast("Pomyślnie usunięto komentarz");
    confirmModalOpened.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  await getComments(from.value, to.value);
});
</script>

<template>
  <ul v-if="comments?.length" class="comment__list">
    <TransitionGroup name="fade">
      <PinCommentItem
        @open-modal="openModal"
        v-for="comment in comments"
        :comment="comment"
        :key="comment.id"
      />
    </TransitionGroup>

    <ConfirmationModal
      :open="confirmModalOpened"
      :loading="isDeleting"
      :color="'hsl(0, 100%, 62%)'"
      @close="confirmModalOpened = false"
      @action="deleteComment(commentToDelete!.id)"
    >
      <template #header>Usuń komentarz</template>
      <template #body>Czy na pewno chcesz usunąć komentarz?</template>
    </ConfirmationModal>

    <button v-if="!loadedAll" @click="loadMore" class="btn btn--gray">
      Wczytaj więcej
    </button>
  </ul>
</template>

<style lang="scss" scoped>
.comment {
  &__list {
    display: flex;
    flex-direction: column;
  }
}

.btn {
  align-self: flex-start;
  margin-top: 0.5rem;
}
</style>
