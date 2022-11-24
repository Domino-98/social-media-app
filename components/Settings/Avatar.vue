<script setup lang="ts">
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { Database } from "~~/lib/database.types";

defineProps<{
  label: string;
  avatarUrl?: string;
}>();

const emit = defineEmits<{
  (e: "updateAvatar", url: string | null): void;
}>();

const toast = useToast();
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

const file = ref();
const isLoading = ref<boolean>(false);

const updateAvatarMetadata = async (url: string | null) => {
  const { data, error } = await client.auth.updateUser({
    data: { avatar_to_display: url },
  });
};

const updateAvatar = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const fileAvatar = target.files![0] as File;
  let extFile = fileAvatar.name.split(".").pop();
  if (!(extFile === "jpg" || extFile === "jpeg" || extFile === "png")) {
    return toast(
      "Akceptowalne są tylko pliki o rozszerzeniach JPG/JPEG oraz PNG",
      {
        type: TYPE.ERROR,
      }
    );
  }

  try {
    isLoading.value = true;
    const { data, error: uploadError } = await client.storage
      .from("avatars")
      .upload(
        `${user.value?.id}/avatarImage.${extFile}?bust=${Date.now()}`,
        fileAvatar,
        {
          cacheControl: "3600",
          upsert: true,
        }
      );

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = client.storage
      .from("avatars")
      .getPublicUrl(
        `${user.value?.id}/avatarImage.${extFile}?bust=${Date.now()}`
      );

    const { error: updateError } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        avatar_url: publicUrl,
      })
      .match({ id: user.value?.id });

    if (updateError) throw updateError;

    updateAvatarMetadata(publicUrl);
    console.log({ publicUrl });
    emit("updateAvatar", publicUrl);

    toast("Pomyślnie zaktualizowano awatar!");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const removeAvatar = async () => {
  isLoading.value = true;
  try {
    const { data, error: removeError } = await client.storage
      .from("avatars")
      .remove([`${user.value?.id}/avatarImage.${"jpg" || "jpeg" || "png"}`]);

    if (removeError) throw removeError;

    const { error: updateError } = await client.auth.updateUser({
      data: {
        avatar_url: null,
      },
    });

    if (updateError) throw updateError;

    const { error } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        avatar_url: null,
      })
      .match({ id: user.value?.id });

    if (error) throw error;

    emit("updateAvatar", null);
    file.value.value = "";
    updateAvatarMetadata(null);

    toast("Pomyślnie usunięto awatar");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="form__group">
    <label class="form__label">Awatar</label>
    <div class="avatar">
      <div class="avatar__container">
        <span
          v-if="isLoading"
          class="loading-spinner loading-spinner--light avatar"
        ></span>
        <img
          v-else
          :src="
            avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          "
          alt=""
          class="avatar__img"
        />
        <font-awesome-icon
          v-show="avatarUrl"
          title="Usuń awatar"
          @click="removeAvatar"
          icon="fa-solid fa-xmark"
          class="avatar__remove"
        />
      </div>

      <input
        ref="file"
        :disabled="isLoading"
        id="uploadAvatar"
        type="file"
        @change="updateAvatar"
        accept="image/png, image/jpeg, image/jpg"
        hidden
      />
      <label for="uploadAvatar" class="btn btn--gray">
        {{ !avatarUrl ? "Dodaj" : "Zmień" }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  &__group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 1rem;
  }

  &__label {
    align-self: flex-start;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    color: var(--font-color);
  }
}

.avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__container {
    position: relative;

    &:hover .avatar__remove {
      display: block;
    }
  }

  &__img {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
  }

  &__remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25rem;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background-color: var(--btn-gray);
    color: var(--btn-color);
    cursor: pointer;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }
}

.loading-spinner.avatar {
  width: 4rem;
  height: 4rem;
  margin-right: 0;
  border-radius: 50%;
  border: 3px solid rgba(var(--opacity-color), 0.3);
  border-top-color: var(--icon-color);
}
</style>
