<script setup lang="ts">
import { RealtimeChannel } from "@supabase/realtime-js";
import { Database } from "~~/lib/database.types";
import { Comment } from "~~/models/comment";
import { Pin } from "~~/models/pin";
import { User } from "~~/models/user";
import commentsApi from "~~/services/api_comments";
import profilesApi from "~~/services/api_profiles";

const client = useSupabaseClient<Database>();
const route = useRoute();
const pinId = computed(() => route.params.id);

const { pin } = usePins();
const { comments, totalComments } = useComments();

const user = useSupabaseUser();
const userProfile = useUser();
const comment = ref<string>("");

const pushComment = (
  comment: any,
  userId: string,
  avatar: string,
  username: string
) => {
  comments.value.push({
    ...comment,
    author: {
      user_id: userId,
      avatar_url: avatar,
      username,
    },
  });
};

let commentChannel: RealtimeChannel;

if (process.client) {
  commentChannel = client
    .channel(`comments:pin_id=eq.${pinId.value}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `pin_id=eq.${pinId.value}`,
      },
      async (payload) => {
        if (payload.new.user_id !== user.value?.id) {
          const profile = await profilesApi().getCurrentUser(
            payload.new.user_id
          );
          pushComment(
            payload.new,
            payload.new.user_id,
            profile.avatar_url!,
            profile.username
          );
        }
        totalComments.value++;
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "comments",
        filter: `pin_id=eq.${pinId.value}`,
      },
      async (payload) => {
        if (user.value?.id !== payload.new.user_id) {
          const senderProfile = await profilesApi().getCurrentUser(
            payload.new.user_id
          );
          const commentIndex = comments.value.findIndex(
            (comment) => comment.id === payload.new.id
          );
          console.log({ senderProfile });
          comments.value[commentIndex] = {
            ...comments.value[commentIndex],
            ...(payload.new as Comment),
          };
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "comments",
        filter: `pin_id=eq.${pinId.value}`,
      },
      async (payload) => {
        if (user.value?.id !== payload.old.user_id) {
          const commentIndex = comments.value.findIndex(
            (comment) => comment.id === payload.old.id
          );

          comments.value.splice(commentIndex, 1);
        }
        totalComments.value--;
      }
    )
    .subscribe();
}

const addComment = async () => {
  if (comment.value) {
    const addedComment = await commentsApi().addComment(
      comment.value,
      +pinId.value,
      pin.value as Pin,
      userProfile.value as User
    );
    console.log({ addedComment });
    pushComment(
      addedComment[0],
      user.value!.id,
      user.value?.user_metadata.avatar_to_display,
      userProfile.value?.username!
    );
    comment.value = "";
  }
};

onUnmounted(async () => {
  await client.removeChannel(commentChannel);
});
</script>

<template>
  <div class="comment__add">
    <img
      class="comment__avatar"
      :src="
        user?.user_metadata.avatar_to_display ||
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
    background-color: rgba(var(--opacity-color), 0.1);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    font-size: 1rem;
    transition: all 0.3s;
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
    filter: invert(73%) sepia(13%) saturate(7%) hue-rotate(103deg)
      brightness(87%) contrast(92%);
    cursor: not-allowed;
  }
}
</style>
