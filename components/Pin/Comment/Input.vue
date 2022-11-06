<script setup lang="ts">
import commentsApi from "~~/services/api_comments";
import profilesApi from "~~/services/api_profiles";

const client = useSupabaseClient();
const route = useRoute();
const pinId = computed(() => route.params.id);

const { comments } = useComments();

const user = useSupabaseUser();
const userProfile = useUser();
let comment = ref<string>();

const pushComment = (comment, userId: string, avatar: string, username: string) => {
  comments.value.push({
    ...comment,
    author: {
      user_id: userId,
      avatar_url: avatar,
      username,
    },
  });
};

const commentSubscription = client
  .from("comments")
  .on("INSERT", async (data) => {
    if (data.new.user_id !== user.value.id) {
      const profile = await profilesApi().getCurrentUser(data.new.user_id);
      pushComment(data.new, data.new.user_id, profile.avatar_url, profile.username);
    }
  })
  .subscribe();

const addComment = async () => {
  if (comment.value) {
    const addedComment = await commentsApi().addComment(comment.value, +pinId.value);
    pushComment(
      addedComment[0],
      user.value.id,
      user.value.user_metadata.avatar_to_display,
      userProfile.value.username
    );

    console.log(addedComment);
    comment.value = null;
  }
};
</script>

<template>
  <div class="comment__add">
    <img
      class="comment__avatar"
      :src="
        user.user_metadata.avatar_to_display ||
        'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      "
      alt=""
    />
    <input
      @keyup.enter="addComment"
      v-model="comment"
      class="comment__input"
      placeholder="Dodaj komentarz"
    />
    <button @click="addComment" class="comment__btn" :disabled="!comment">
      <img src="~/assets/icons/send.svg" alt="Send" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.comment {
  &__avatar {
    align-self: flex-start;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }

  &__add {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  &__input {
    width: 100%;
    background-color: rgba(var(--opacity-color), 0.09);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    font-size: 1rem;
    transition: all 0.3s;

    &:focus {
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
  }

  &__btn {
    display: flex;
    align-items: center;
  }

  &__btn img {
    width: 2rem;
    filter: var(--font-color-filter);
    transition: all 0.3s;
    cursor: pointer;
  }

  &__btn:hover img {
    filter: var(--primary-color-filter);
  }

  &__btn:disabled img {
    filter: invert(73%) sepia(13%) saturate(7%) hue-rotate(103deg) brightness(87%)
      contrast(92%);
    cursor: not-allowed;
  }
}
</style>
