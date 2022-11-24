<script setup lang="ts">
import notificationsApi from "~~/services/api_notifications";

const user = useSupabaseUser();
const { notifications } = useNotifications();
const { timeFromNow } = useDateTime();

const deleteNotification = async (id: number) => {
  await notificationsApi().deleteNotification(id);
  const notificationIndex = notifications.value.findIndex(
    (notification) => notification.id === id
  );
  notifications.value.splice(notificationIndex, 1);
};

onMounted(async () => {
  const unreadNotifications = notifications.value.filter(
    (notif) => notif.status === "unread" && user.value?.id === notif.recipent_id
  );
  console.log({ unreadNotifications });
  if (unreadNotifications.length)
    setTimeout(
      async () => await notificationsApi().readNotifications(user.value!.id),
      200
    );
});
</script>

<template>
  <div class="notifications__dropdown">
    <header class="notifications__header">
      <h2 class="notifications__heading">Powiadomienia</h2>
      <font-awesome-icon icon="fa-regular fa-bell" class="icon icon--bell" />
    </header>

    <p v-if="!notifications.length" class="notifications__alert">
      Brak powiadomień
    </p>

    <TransitionGroup v-else name="scale" tag="ul" class="notifications__list">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="notifications__item"
      >
        <RouterLink
          :to="`/profile/${notification.notifier?.profile_id}`"
          class="notifications__avatar-link"
        >
          <img
            :src="
              notification.notifier?.avatar_url ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            "
            class="notifications__avatar"
          />
        </RouterLink>

        <div class="notifications__content">
          <p
            v-html="notification.notification_content"
            class="notifications__content"
          ></p>

          <span class="notifications__date">{{
            timeFromNow(notification.created_at)
          }}</span>
        </div>

        <font-awesome-icon
          @click.prevent="deleteNotification(notification.id as number)"
          v-tippy
          content="Usuń powiadomienie"
          icon="fa-solid fa-trash"
          class="icon icon--delete"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.notifications {
  &__unread {
    background-color: var(--bg-color-primary);
    color: var(--primary-color);
    border: 2px solid var(--primary-color);

    &:hover {
      background-color: var(--primary-color);
      color: #fff;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 5px 5px -5px var(--shadow-color);
    padding: 0.75rem;
  }

  &__heading {
    font-size: 1.3rem;
    font-weight: 500;
  }

  &__alert {
    padding: 1rem;
    font-style: italic;
    font-size: 1rem;
  }

  &__list {
    max-height: 40vh;
    padding: 1rem;
    overflow-y: auto;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--opacity-color), 0.25) var(--bg-color-primary);

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

  &__item {
    position: relative;
    display: flex;
    gap: 0.5rem;
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: all 0.2s;
    text-align: left;
    cursor: pointer;

    &:hover {
      background-color: rgba(var(--opacity-color), 0.1);
    }

    &:hover .icon {
      visibility: visible;
      opacity: 1;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding-right: 1rem;
  }

  &__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;

    &-link {
      flex-shrink: 0;
    }
  }

  &__date {
    text-align: left;
    font-size: 0.75rem;
    color: rgba(var(--opacity-color), 0.6);
  }
}

.icon {
  &--bell {
    font-size: 1.2rem;
  }

  &--delete {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    transform: translateY(-50%);
    visibility: hidden;
    opacity: 0;
    font-size: 1.1rem;
    transition: all 0.2s;

    &:hover {
      color: #ff4040 !important;
    }
  }
}
</style>
