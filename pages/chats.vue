<script setup lang="ts">
import { RealtimeChannel } from "@supabase/realtime-js";
import { Database } from "~~/lib/database.types";
import { Message } from "~~/models/chat";
import chatApi from "~~/services/api_chat";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { chats } = useMessages();
const { timeFromNow } = useDateTime();

const handleNewMessage = (message: Message) => {
  console.log(message);
  const chatIndex = chats.value.findIndex(
    (chat) => chat.chatroom_id === message.chatroom_id
  );
  chats.value[chatIndex] = {
    ...chats.value[chatIndex],
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    message: message.message,
    updated_at: message.updated_at,
    status: message.status,
  };
  chats.value.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
};

let senderChannel: RealtimeChannel;

if (process.client) {
  senderChannel = client
    .channel(`messages:sender_id=eq.${user.value?.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `sender_id=eq.${user.value?.id}`,
      },
      async (payload) => {
        handleNewMessage(payload.new as Message);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `sender_id=eq.${user.value?.id}`,
      },
      async (payload) => {
        console.log({ payload });
        if (payload.new.length) {
          chats.value = payload.new.map((chatObj: Message) => {
            return {
              ...chatObj,
              status: "read",
            };
          });
        } else {
          const chatIndex = chats.value.findIndex(
            (chat) => chat.chatroom_id === payload.new.chatroom_id
          );
          chats.value[chatIndex] = {
            ...chats.value[chatIndex],
            status: payload.new.status,
            updated_at: payload.new.updated_at,
          };
        }
      }
    )
    .subscribe();
}

const route = useRoute();
const isMobile = ref<boolean>(false);

const onResize = () => {
  isMobile.value = window.innerWidth <= 600;
};

const isLoading = ref<boolean>(true);

const from = ref<number>(0);
const to = ref<number>(23);
const take = ref<number>(23);
const scrolledToBottom = ref<boolean>(false);

const { checkIfScrolledBottom } = useScroll();

const handleInfiniteScroll = async (e: Event) => {
  const bottom = checkIfScrolledBottom(e.target as HTMLElement);
  if (bottom && !scrolledToBottom.value) {
    scrolledToBottom.value = true;
    from.value = to.value + 1;
    to.value += take.value + 1;
    try {
      const fetchedChats = await chatApi().getChatrooms(
        user.value?.id!,
        from.value,
        to.value
      );
      chats.value.push(...(fetchedChats as Message[]));
      setTimeout(() => (scrolledToBottom.value = false), 500);
    } catch (error) {
      console.log(error);
    }
  }
};

const getChatrooms = async () => {
  const fetchedChats = await chatApi().getChatrooms(user.value?.id as string);
  chats.value = fetchedChats;
};

const chatsEl = ref<HTMLElement>();

onMounted(async () => {
  await getChatrooms();
  onResize();
  window.addEventListener("resize", onResize, { passive: true });
  if (chats.value.length) isLoading.value = false;
  if (chats.value.length && !route.params.id && !isMobile.value) {
    await navigateTo(`/chats/${chats.value[0].chatroom_id}`);
  }
  chatsEl.value?.addEventListener("scroll", handleInfiniteScroll);
});

onUnmounted(async () => {
  await client.removeChannel(senderChannel);
  window.removeEventListener("resize", onResize);
  chatsEl.value?.removeEventListener("scroll", handleInfiniteScroll);
});

definePageMeta({
  layout: "navigation",
  middleware: "auth",
});
</script>

<template>
  <main>
    <div class="chats">
      <div class="chats__container" :class="{ 'show-chat': !route.params.id }">
        <header class="chats__header">
          <font-awesome-icon
            icon="fa-solid fa-comments"
            class="icon icon--chats"
          />
          <h1 class="chats__heading">Czaty</h1>
        </header>
        <div v-if="chats.length" ref="chatsEl" class="chats__list">
          <NuxtLink
            :to="`/chats/${chat.chatroom_id}`"
            v-for="chat in chats"
            :key="chat.id"
            class="chats__user"
          >
            <img
              :src="
                (chat.receiver?.id !== user!.id
                  ? chat.receiver?.avatar_url
                  : chat.sender?.avatar_url) ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              "
              class="user__avatar"
            />

            <div class="user__info">
              <span class="user__name">{{
                chat.receiver?.id !== user!.id
                  ? chat.receiver?.username
                  : chat.sender?.username
              }}</span>
              <div class="user__message-date">
                <span
                  v-if="chat.status !== 'deleted'"
                  class="user__message"
                  :class="{
                    unread: chat.status === 'unread',
                  }"
                  >{{
                    chat.sender_id === user!.id
                      ? `Ty: ${chat.message}`
                      : chat.message
                  }}
                </span>
                <span v-else class="user__message user__message--deleted"
                  >{{
                    chat.sender_id === user!.id
                      ? `Ty: Usunąłeś wiadomość`
                      : "Usunięto wiadomość"
                  }}
                </span>
                <span class="user__date">{{
                  timeFromNow(chat.updated_at as string)
                }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <span v-else-if="isLoading" class="loading-spinner"></span>

        <p v-else-if="!chats.length" class="chats__alert">
          Brak <span>wiadomości</span>
        </p>
      </div>

      <NuxtPage />
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 75em) {
    margin: 2rem;
  }

  @media only screen and (max-width: 62.5em) {
    margin: 0 1rem;
  }
}

.chats {
  position: relative;
  display: flex;
  max-width: 60rem;
  width: 100%;
  height: 85vh;
  margin-top: 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--bg-color-secondary);
  color: var(--font-color);
  overflow: hidden;
  transition: all 0.2s;

  &__container {
    width: 30%;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color-secondary);
    box-shadow: 0 0 4px 0 var(--shadow-color);

    @media only screen and (max-width: 75em) {
      width: auto;
    }

    @media only screen and (max-width: 37.5em) {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      transform: translateX(-100%);
      box-shadow: none;
      transition: all 0.2s;
    }
  }

  &__alert {
    margin-top: 1.5rem;
    border-radius: 0.5rem;
    color: var(--btn-gray);
    text-align: center;
    font-size: 500;

    @media only screen and (max-width: 75em) {
      & span {
        display: none;
      }
    }

    @media only screen and (max-width: 37.5em) {
      & span {
        display: block;
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: var(--bg-color-primary) rgba(var(--opacity-color), 0.25);

    @media only screen and (max-width: 75em) {
      padding: 0.5rem;
    }

    &::-webkit-scrollbar {
      width: 9px;
    }

    &::-webkit-scrollbar-track {
      background: var(--bg-color-primary);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(var(--opacity-color), 0.25);
    }
  }

  &__header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    box-shadow: 0 5px 5px -5px var(--shadow-color);
    text-align: center;
  }

  &__heading {
    font-size: 1.5rem;
    font-weight: 500;

    @media only screen and (max-width: 75em) {
      display: none;
    }

    @media only screen and (max-width: 37.5em) {
      display: block;
    }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    @media only screen and (max-width: 75em) {
      padding: 0;
    }

    @media only screen and (max-width: 37.5em) {
      padding: 0.5rem;
    }

    &:hover {
      background-color: rgba(var(--opacity-color), 0.075);
    }
  }
}

.user {
  &__avatar {
    width: 2.75rem;
    height: auto;
    margin: 0 auto;
    border-radius: 50%;
  }

  &__info {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: hidden;

    @media only screen and (max-width: 75em) {
      display: none;
    }

    @media only screen and (max-width: 37.5em) {
      display: flex;
    }
  }

  &__name {
    font-size: 0.9rem;
  }

  &__message-date {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    color: rgba(var(--opacity-color), 0.75);
  }

  &__message {
    flex: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8rem;

    &--deleted {
      font-style: italic;
    }
  }

  &__date {
    flex: 2;
    font-size: 0.65rem;
    text-align: right;
  }
}

a.router-link-active {
  background-color: rgba(0, 0, 0, 0.1);
}

.unread {
  font-weight: 700;
}

.icon {
  color: var(--icon-color);

  &--chats {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.5rem;
  }
}

.show-chat {
  transform: translateX(0);
}

.loading-spinner {
  margin: 0 auto;
  margin-top: 1.5rem;
}
</style>
