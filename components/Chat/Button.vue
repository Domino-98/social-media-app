<script setup lang="ts">
import chatApi from "~~/services/api_chat";
import profilesApi from "~~/services/api_profiles";
import { Message } from "~~/models/chat";
import { RealtimeChannel } from "@supabase/realtime-js";
import { Database } from "~~/lib/database.types";
import { User } from "~~/models/user";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const profile = useUser();
const { chats } = useMessages();

const unreadChats = computed(() =>
  chats.value.filter(
    (chat) => chat.status === "unread" && chat.receiver_id === user.value?.id
  )
);

const handleNewMessage = async (message: Message) => {
  const chatIndex = chats.value.findIndex(
    (chat) => chat.chatroom_id === message.chatroom_id
  );
  if (chats.value[chatIndex]) {
    chats.value[chatIndex] = {
      ...chats.value[chatIndex],
      sender_id: message.sender_id,
      receiver_id: message.receiver_id,
      message: message.message,
      updated_at: message.updated_at,
      status: message.status,
    };
  } else {
    const senderProfile = await profilesApi().getCurrentUser(message.sender_id);
    chats.value.unshift({
      ...message,
      sender: senderProfile as User,
      receiver: profile.value as User,
    });
  }
  chats.value.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
};

let chatChannel: RealtimeChannel;

const setChannel = () => {
  chatChannel = client
    .channel(`messages:receiver_id=eq.${user.value?.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.value?.id}`,
      },
      async (payload) => {
        handleNewMessage(payload.new as any);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.value?.id}`,
      },
      async (data) => {
        const chatIndex = chats.value.findIndex(
          (chat) => chat.chatroom_id === data.new.chatroom_id
        );
        chats.value[chatIndex] = {
          ...chats.value[chatIndex],
          status: data.new.status,
          updated_at: data.new.updated_at,
        };
      }
    )
    .subscribe();
};

const getChatrooms = async () => {
  const fetchedChats = await chatApi().getChatrooms(user.value?.id as string);
  chats.value = fetchedChats;
};

onMounted(async () => {
  if (user.value) {
    await getChatrooms();
    setChannel();
  }
});

onUnmounted(async () => {
  if (user.value)
    await client.removeChannel(chatChannel);
});

watch(
  () => user.value?.id,
  async () => {
    if (user.value) {
      await getChatrooms();
      setChannel();
    }
  }
);
</script>

<template>
  <NuxtLink
    ref="addPinEl"
    to="/chats"
    class="navbar__chats"
    content="Czaty"
    v-tippy
  >
    <font-awesome-icon icon="fa-solid fa-comment" size="xl" />
    <Transition name="scale">
      <span v-if="unreadChats.length" class="badge">{{
        unreadChats.length
      }}</span>
    </Transition>
  </NuxtLink>
</template>

<style lang="scss" scoped></style>
