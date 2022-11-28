<script setup lang="ts">
import { RealtimeChannel } from "@supabase/realtime-js";
import profilesApi from "~~/services/api_profiles";
import notificationsApi from "~~/services/api_notifications";
import { Database } from "~~/lib/database.types";
import { onClickOutside } from "@vueuse/core";
import type { Notification } from "~~/models/notification";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();

const { notifications, totalNotifications } = useNotifications();

const unreadNotifications = computed(() =>
  notifications.value.filter((notification) => notification.status === "unread")
);

const notificationsVisible = ref<boolean>(false);

let notificationsChannel: RealtimeChannel;

const setChannel = () => {
  notificationsChannel = client
    .channel(`public:notifications:recipent_id=eq.${user.value?.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `recipent_id=eq.${user.value?.id}`,
      },
      async (payload) => {
        const profile = await profilesApi().getCurrentUser(
          payload.new.notifier_id
        );
        notifications.value.unshift({
          ...(payload.new as Notification),
          notifier: {
            id: profile.id,
            avatar_url: profile.avatar_url as string,
          },
        });
        totalNotifications.value++;
        if (route.query.notifications)
          await notificationsApi().readNotification(
            payload.new.id,
            payload.new.recipent_id
          );
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "notifications",
        filter: `recipent_id=eq.${user.value?.id}`,
      },
      (payload) => {
        if (payload.new.length) {
          notifications.value = payload.new.map(
            (notificationObj: Notification) => {
              return {
                ...notificationObj,
                status: "read",
              };
            }
          );
        } else {
          const notifIndex = notifications.value.findIndex(
            (notif) => notif.id === payload.new.id
          );
          notifications.value[notifIndex] = {
            ...notifications.value[notifIndex],
            status: "read",
          };
        }
      }
    )
    .subscribe();
};

const toggleNotifications = (): void => {
  notificationsVisible.value = !notificationsVisible.value;
  let query = Object.assign({}, route.query);
  if (notificationsVisible.value) {
    query = { ...route.query, notifications: "true" };
  } else {
    delete query.notifications;
  }
  router.push({ query });
};

const notificationsEl = ref();

onClickOutside(notificationsEl, (e: Event) => {
  if ((e.target as HTMLElement).id !== "notificationsBtn")
    toggleNotifications();
});

const getNotifications = async () => {
  const fetchedNotifications = await notificationsApi().getNotifications(
    user.value?.id as string
  );
  notifications.value = fetchedNotifications as Notification[];
  console.log("get notifications");
};

onMounted(async () => {
  if (user.value) {
    await getNotifications();
    if (route.query.notifications) notificationsVisible.value = true;
    setChannel();
  }
});

onUnmounted(async () => {
  await client.removeChannel(notificationsChannel);
});

watch(
  () => user.value?.id,
  async () => {
    if (user.value) {
      await getNotifications();
      setChannel();
    }
  }
);
</script>

<template>
  <div class="notifications">
    <button
      @click="toggleNotifications"
      class="notifications__toggle"
      content="Powiadomienia"
      v-tippy
      id="notificationsBtn"
    >
      <font-awesome-icon
        icon="fa-solid fa-bell"
        size="xl"
        class="icon icon--notifications"
      />
    </button>

    <Transition name="scale">
      <span v-if="unreadNotifications.length" class="badge">{{
        unreadNotifications.length
      }}</span>
    </Transition>

    <Transition name="scale">
      <NotificationDropdown v-if="notificationsVisible" ref="notificationsEl" />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.notifications {
  position: relative;
  color: var(--font-color);
}

.info {
  padding: 0.75rem;
  font-style: italic;
  font-size: 0.9rem;
}

.icon {
  &--notifications {
    pointer-events: none;
  }
}
</style>
