<script setup lang="ts">
import chatApi from "~~/services/api_chat";
import { RealtimeChannel } from "@supabase/realtime-js";
import { Message } from "~~/models/chat";
import { Database } from "~~/lib/database.types";
import { User } from "~~/models/user";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const chatroomId = computed(() => route.params.id);

const { messages } = useMessages();

const messagesEl = ref<HTMLUListElement>();

const scrollBottom = (userId?: string) => {
  if (
    messagesEl.value!.scrollHeight - messagesEl.value!.scrollTop < 1000 ||
    userId === user.value?.id
  )
    setTimeout(() => {
      messagesEl.value!.scrollTop = messagesEl.value!.scrollHeight;
    }, 300);
};

let messageChannel: RealtimeChannel;

if (process.client) {
  messageChannel = client
    .channel(`messages:chatroom_id=eq.${chatroomId.value}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chatroom_id=eq.${chatroomId.value}`,
      },
      async (payload) => {
        if (payload.new.receiver_id === user.value?.id) {
          messages.value.push(payload.new as Message);
          await chatApi().readMessage(payload.new.id, payload.new.receiver_id);
        }
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `chatroom_id=eq.${chatroomId.value}`,
      },
      async (payload) => {
        messages.value[
          messages.value.findIndex((mess) => mess.id === payload.new.id)
        ] = payload.new as Message;
      }
    )
    .subscribe();
}

let typingTimeout: any;
const isTyping = ref<string>("");

const setUserTyping = (value: string) => {
  clearTimeout(typingTimeout);
  isTyping.value = value;
  if (isTyping.value)
    typingTimeout = setTimeout(() => (isTyping.value = ""), 1500);
};

const otherUser = ref<User>();

const goBack = async () => {
  await navigateTo("/chats");
};

const getMessages = async (
  chatroomId: string,
  userId: string,
  from?: number,
  to?: number
) => {
  const fetchedMsgs = await chatApi().getMessages(chatroomId, userId);
  messages.value = fetchedMsgs as Message[];

  otherUser.value =
    fetchedMsgs[0]?.receiver_id !== userId
      ? (fetchedMsgs[0]?.receiver as User)
      : (fetchedMsgs[0]?.sender as User);

  setTimeout(
    () =>
      messagesEl.value
        ? (messagesEl.value.scrollTop = messagesEl.value?.scrollHeight)
        : null,
    500
  );
};

const from = ref<number>(0);
const to = ref<number>(15);
const take = ref<number>(15);
const scrolledToTop = ref<boolean>(false);
const scrollHeight = ref<number>(0);
const isLoading = ref<boolean>(false);

const handleChatScroll = async (e: Event) => {
  if ((e.target as HTMLElement).scrollTop == 0 && !scrolledToTop.value) {
    isLoading.value = true;
    try {
      scrolledToTop.value = true;
      if (!scrollHeight.value)
        scrollHeight.value = (e.target as HTMLElement).scrollHeight;
      from.value = to.value + 1;
      to.value += take.value + 1;
      const fetchedMessages = await chatApi().getMessages(
        chatroomId.value as string,
        user.value?.id!,
        from.value,
        to.value
      );
      messages.value.unshift(...(fetchedMessages as Message[]));
      if (fetchedMessages.length)
        messagesEl.value?.scroll(0, scrollHeight.value);
      setTimeout(() => (scrolledToTop.value = false), 500);
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  }
};

onMounted(async () => {
  await getMessages(chatroomId.value as string, user.value!.id);
  messagesEl.value?.addEventListener("scroll", handleChatScroll);
});

onUnmounted(async () => {
  await client.removeChannel(messageChannel);
  messages.value = [];
  messagesEl.value?.removeEventListener("scroll", handleChatScroll);
});

watch(chatroomId, async (newRoom) => {
  await getMessages(newRoom as string, user.value!.id);
});
</script>

<template>
  <div v-show="messages.length" class="message">
    <header class="message__header">
      <button @click.prevent="goBack" class="btn-back">
        <font-awesome-icon
          icon="fa-solid fa-arrow-left"
          class="icon icon--back"
        />
      </button>

      <NuxtLink
        :to="`/profile/${otherUser?.profile_id}`"
        class="message__avatar-link"
      >
        <img
          :src="
            otherUser?.avatar_url ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          class="message__avatar message__avatar--sm"
        />
      </NuxtLink>

      <h1>{{ otherUser?.username }}</h1>
    </header>
    <ul ref="messagesEl" class="message__list">
      <TransitionGroup name="fade">
        <ChatMessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :other-user="otherUser!"
        />
      </TransitionGroup>
    </ul>

    <Transition name="scale">
      <div v-if="isTyping" class="message__typing">
        <span>{{ otherUser?.username }} pisze</span>
        <div class="tiblock">
          <div class="tidot"></div>
          <div class="tidot"></div>
          <div class="tidot"></div>
        </div>
      </div>
    </Transition>

    <ChatMessageInput
      @user-typing="setUserTyping"
      @scroll-bottom="scrollBottom"
      :other-user="otherUser!"
    />
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  width: 70%;

  @media only screen and (max-width: 75em) {
    width: 100%;
  }

  &__header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    box-shadow: 0 5px 5px -5px var(--shadow-color);
    text-align: left;

    @media only screen and (max-width: 50em) {
      padding: 1rem;
    }

    @media only screen and (max-width: 37.5em) {
      padding: 0.75rem;
      gap: 0.75rem;
    }

    & h1 {
      font-size: 1.4rem;
      overflow: hidden;
      text-overflow: ellipsis;

      @media only screen and (max-width: 37.5em) {
        font-size: 1.2rem;
      }
    }
  }

  &__avatar {
    width: 3rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;

    &--sm {
      width: 2rem;
    }

    &-link {
      flex-shrink: 0;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--opacity-color), 0.25) var(--bg-color-primary);

    @media only screen and (max-width: 50em) {
      padding: 1rem;
    }

    @media only screen and (max-width: 37.5em) {
      padding: 0.75rem;
    }

    &::-webkit-scrollbar {
      width: 9px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(var(--opacity-color), 0.05);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(var(--opacity-color), 0.25);
    }
  }

  &__typing {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 1.25rem;
    font-style: italic;
    font-size: 0.9rem;
    color: gray;
  }
}

.icon {
  &--back {
    font-size: 1.3rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.btn-back {
  display: none;

  @media only screen and (max-width: 37.5em) {
    display: block;
  }
}

.tiblock {
  align-items: flex-end;
  display: flex;
  gap: 0.025rem;
  margin-bottom: 0.4rem;
  height: 17px;
}

.tidot {
  animation: mercuryTypingAnimation 1.5s infinite ease-in-out;
  border-radius: 2px;
  display: inline-block;
  height: 4px;
  margin-right: 2px;
  width: 4px;
  background-color: #90949c;
}

@keyframes mercuryTypingAnimation {
  0% {
    -webkit-transform: translateY(0px);
  }
  28% {
    -webkit-transform: translateY(-5px);
  }
  44% {
    -webkit-transform: translateY(0px);
  }
}

.tidot:nth-child(1) {
  animation-delay: 200ms;
}
.tidot:nth-child(2) {
  animation-delay: 300ms;
}
.tidot:nth-child(3) {
  animation-delay: 400ms;
}

.loading-spinner {
  text-align: center;
}
</style>
