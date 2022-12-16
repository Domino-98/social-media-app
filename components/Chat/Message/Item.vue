<script setup lang="ts">
import chatApi from "~~/services/api_chat";
import { Message } from "~~/models/chat";
import { User } from "~~/models/user";

const props = defineProps<{
  message: Message;
  otherUser: User;
}>();

const user = useSupabaseUser();
const { messages } = useMessages();
const { timeFromNow } = useDateTime();

const deleteMessage = async (id: number) => {
  const mess = await chatApi().deleteMessage(id);
  const messIndex = messages.value.findIndex(
    (message) => message.id === mess.id
  );
  if (messIndex) {
    messages.value[messIndex] = mess;
  }
};
</script>

<template>
  <li
    class="message__item"
    :class="{
      'own-message': message.sender_id === user?.id,
    }"
  >
    <font-awesome-icon
      @click.prevent="deleteMessage(message.id)"
      v-show="message.sender_id === user?.id && message.status !== 'deleted'"
      v-tippy
      content="Usuń wiadomość"
      icon="fa fa-trash"
      class="icon icon--delete"
    />
    <font-awesome-icon
      v-show="message.sender_id === user?.id && message.status !== 'deleted'"
      :icon="`fa-${
        message.status === 'unread' ? 'regular' : 'solid'
      } fa-circle-check`"
      v-tippy
      :content="`${
        message.status === 'unread' ? 'Nie wyświetlono' : 'Wyświetlono'
      }`"
      class="icon icon--status"
    />
    <NuxtLink
      v-show="message.receiver_id === user?.id"
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
    <p
      v-if="message.status !== 'deleted'"
      :class="{
        unread: message.sender_id === user?.id && message.status === 'unread',
      }"
      class="message__content"
    >
      {{ message.message }}
    </p>
    <p v-else class="message__deleted">Usunięto wiadomość</p>

    <span class="message__date">{{
      timeFromNow(message.updated_at as string)
    }}</span>
  </li>
</template>

<style lang="scss" scoped>
.message {
  &__item {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 50%;
    height: 100%;

    @media only screen and (max-width: 62.5em) {
      width: 75%;
    }

    @media only screen and (max-width: 37.5em) {
      width: 100%;
    }

    &:hover .icon--delete {
      opacity: 1;
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

  &__content {
    padding: 0.5rem;
    border-radius: 1rem;
    background-color: rgba(var(--opacity-color), 0.25);
    color: #fff;
    word-wrap: break-word;
    overflow: hidden;
  }

  &__date {
    text-align: center;
    font-size: 0.65rem;
  }

  &__deleted {
    padding: 0.5rem;
    border-radius: 2rem;
    background-color: rgba(var(--opacity-color), 0.25);
    color: #fff;
    font-style: italic;
    font-size: 0.8rem;
    text-align: center;
  }
}

.own-message {
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;

  & p {
    order: 1;
    background-color: var(--primary-color);
  }
}

.icon {
  outline: none;

  &--status,
  &--delete {
    color: rgba(var(--opacity-color), 0.5);
  }

  &--delete {
    cursor: pointer;
    transition: all 0.2s;

    @media (hover: hover) {
      opacity: 0;
    }

    &:hover {
      color: #ff4040;
    }
  }
}
</style>
