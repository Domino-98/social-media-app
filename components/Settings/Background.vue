<script setup lang="ts">
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { Database } from "~~/lib/database.types";

defineProps<{
  label: string;
  backgroundUrl?: string;
}>();

const emit = defineEmits<{
  (e: "updateBackground", url: string): void;
}>();

const toast = useToast();
const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

const file = ref();
const isLoading = ref<boolean>(false);

const updateBackground = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const fileBg = target.files![0] as File;
  let extFile = fileBg.name.split(".").pop();
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
      .from("backgrounds")
      .upload(
        `${user.value?.id}/backgroundImage.${extFile}?bust=${Date.now()}`,
        fileBg,
        {
          cacheControl: "3600",
          upsert: true,
        }
      );

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = client.storage
      .from("backgrounds")
      .getPublicUrl(
        `${user.value?.id}/backgroundImage.${extFile}?bust=${Date.now()}`
      );

    const { error: updateError } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        background_url: publicUrl,
      })
      .match({ id: user.value?.id });

    if (updateError) throw updateError;
    emit("updateBackground", publicUrl);

    toast("Pomyślnie zaktualizowano tło!");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const removeBackground = async () => {
  isLoading.value = true;
  try {
    const { data, error: removeError } = await client.storage
      .from("backgrounds")
      .remove([
        `${user.value?.id}/backgroundImage.${"jpg" || "jpeg" || "png"}`,
      ]);

    if (removeError) throw removeError;

    const { error: updateError } = await client.auth.updateUser({
      data: {
        background_url: null,
      },
    });

    if (updateError) throw updateError;

    const { error } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        background_url: null,
      })
      .match({ id: user.value?.id });

    if (error) throw error;

    emit("updateBackground", "");
    file.value.value = "";

    toast("Pomyślnie usunięto tło profilowe");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="form__group">
    <label for="" class="form__label">{{ label }}</label>
    <div class="background">
      <div
        v-if="backgroundUrl"
        :style="{
          background: `url(${backgroundUrl}) no-repeat center `,
          backgroundSize: 'cover',
        }"
        class="background__img"
      ></div>

      <div class="background__btns">
        <input
          ref="file"
          :disabled="isLoading"
          id="uploadBackground"
          type="file"
          @change="updateBackground"
          accept="image/png, image/jpeg, image/jpg"
          hidden
        />
        <label
          for="uploadBackground"
          class="btn btn--gray"
          :class="{ test: isLoading }"
        >
          <span
            v-show="isLoading"
            class="loading-spinner loading-spinner--sm loading-spinner--light"
          ></span>
          <span>{{ !backgroundUrl ? "Dodaj" : "Zmień" }}</span>
        </label>
        <button
          type="button"
          :disabled="isLoading"
          v-if="backgroundUrl"
          @click.prevent="removeBackground"
          class="btn btn--gray"
        >
          Usuń
        </button>
      </div>
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
.background {
  &__img {
    width: 100%;
    height: 12.5rem;
    border-radius: 1.5rem;
  }

  &__btns {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}
</style>
