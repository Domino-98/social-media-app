<script setup lang="ts">
import chatApi from "~~/services/api_chat";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { User } from "~~/models/user";
import { Message } from "~~/models/chat";

const props = defineProps<{
  otherUser: User;
}>();

const toast = useToast();
const user = useSupabaseUser();
const { messages } = useMessages();

const emit = defineEmits<{
  (e: "scrollBottom"): void;
}>();

const message = ref<string>("");

const sendMessage = async () => {
  try {
    const msg = await chatApi().createMessage(
      user.value?.id!,
      props.otherUser.id,
      message.value
    );
    console.log(msg);
    messages.value.push(msg as Message);
    message.value = "";
    emit("scrollBottom");
  } catch (error) {
    if (error instanceof Error)
      toast(error.message, {
        type: TYPE.ERROR,
      });
  }
};
</script>

<template>
  <form class="message__send">
    <input
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
