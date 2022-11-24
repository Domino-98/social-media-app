<script setup lang="ts">
import chatApi from "~~/services/api_chat";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";

const props = defineProps<{
  receiverId: string;
}>();

const toast = useToast();
const user = useSupabaseUser();
const message = ref<string>("");

const isSending = ref<boolean>(false);

const sendMessage = async () => {
  isSending.value = true;
  try {
    await chatApi().createMessage(
      user.value!.id,
      props.receiverId,
      message.value
    );
    message.value = "";
    toast("Pomyślnie wysłano wiadomość");
  } catch (error) {
    if (error instanceof Error)
      toast(error.message, {
        type: TYPE.ERROR,
      });
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <div class="chat">
    <form>
      <input
        v-model="message"
        type="text"
        placeholder="Wiadomość..."
        class="chat__input"
      />
      <button
        type="submit"
        @click.prevent="sendMessage"
        :disabled="!message || isSending"
        class="btn btn--sm btn--primary"
      >
        <span
          v-show="isSending"
          class="loading-spinner loading-spinner--sm loading-spinner--light"
        ></span>
        <span>{{ isSending ? "Wysyłanie..." : "Wyślij" }}</span>
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.chat {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 100%;
  width: 15rem;
  margin-top: 0.25rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
  background-color: var(--bg-color-secondary);

  & form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__input {
    width: 100%;
    background-color: rgba(var(--opacity-color), 0.15);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    font-size: 1rem;
    color: var(--font-color);
    transition: all 0.3s;
  }
}
</style>
