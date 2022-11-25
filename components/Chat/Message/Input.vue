<script setup lang="ts">
import chatApi from "~~/services/api_chat";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { User } from "~~/models/user";
import { Message } from "~~/models/chat";
import { RealtimeChannel } from "@supabase/realtime-js";

const props = defineProps<{
  otherUser: User;
}>();

const route = useRoute();
const chatroomId = computed(() => route.params.id);
const client = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();
const { messages } = useMessages();

const emit = defineEmits<{
  (e: "scrollBottom", userId?: string): void;
  (e: "userTyping", value: string): void;
}>();

const message = ref<string>("");

const sendMessage = async () => {
  try {
    const msg = await chatApi().createMessage(
      user.value?.id!,
      props.otherUser.id,
      message.value
    );
    messages.value.push(msg as Message);
    message.value = "";
    emit("scrollBottom", user.value?.id as string);
  } catch (error) {
    if (error instanceof Error)
      toast(error.message, {
        type: TYPE.ERROR,
      });
  }
};

let typingChannel: RealtimeChannel;
const typingActivated = ref<boolean>(false);

if (process.client) {
  typingChannel = client.channel(`${chatroomId.value}`, {
    config: {
      presence: { key: user.value?.id },
    },
  });
  typingChannel
    .on("presence", { event: "sync" }, () => {
      presenceChanged();
    })
    .subscribe();
}

const trackTyping = async (e: Event) => {
  await typingChannel.track({
    isTyping: Date.now(),
  });
};

// Receive Presence updates
const presenceChanged = () => {
  const newState = typingChannel.presenceState();
  typingChannel;
  console.log({ newState });
  if (Object.keys(newState).length !== 0 && typingActivated.value) {
    const lastUser = Object.keys(newState).reduce((a, b) =>
      newState[a][0].isTyping > newState[b][0].isTyping ? a : b
    );
    if (lastUser !== user.value?.id) {
      emit("userTyping", lastUser);
      emit("scrollBottom");
    }
  }
  typingActivated.value = true;
};

onUnmounted(() => {
  typingChannel.untrack().then((status) => console.log({ status }));
});
</script>

<template>
  <form class="message__send">
    <input
      @input="trackTyping"
      v-model="message"
      type="text"
      placeholder="Wiadomość..."
      class="message__input"
    />
    <button
      type="submit"
      @click.prevent="sendMessage"
      :disabled="!message"
      class="btn btn--sm btn--primary"
    >
      <span>Wyślij</span>
      <font-awesome-icon
        icon="fa-solid fa-paper-plane"
        class="icon icon--send"
      />
    </button>
  </form>
</template>

<style lang="scss" scoped>
.message {
  &__send {
    display: flex;
    gap: 0.75rem;
    margin-top: auto;
    padding: 1.5rem;
    box-shadow: 0 -5px 5px -5px var(--shadow-color);

    @media only screen and (max-width: 50em) {
      padding: 1.25rem;
    }

    @media only screen and (max-width: 37.5em) {
      padding: 0.75rem;

      & span {
        display: none;
      }
    }
  }

  &__input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 2rem;
    background-color: rgba(var(--opacity-color), 0.1);

    @media only screen and (max-width: 37.5em) {
      padding: 0.75rem;

      & span {
        display: none;
      }
    }
  }
}

.icon {
  &--send {
    margin-left: 0.5rem;

    @media only screen and (max-width: 37.5em) {
      margin-left: 0;
    }
  }
}
</style>
