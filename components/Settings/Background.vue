<script setup lang="ts">
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";

defineProps<{
  backgroundUrl?: string;
}>();

const emit = defineEmits<{
  (e: "updateBackground", url: string): void;
}>();

const toast = useToast();
const client = useSupabaseClient();

const file = ref();
let isLoading = ref<boolean>(false);

const updateBackground = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const fileBg = target.files[0] as File;
  let extFile = fileBg.name.split(".").pop();
  if (!(extFile === "jpg" || extFile === "jpeg" || extFile === "png")) {
    return toast("Akceptowalne są tylko pliki o rozszerzeniach JPG/JPEG oraz PNG", {
      type: TYPE.ERROR,
    });
  }

  try {
    isLoading.value = true;
    const { data, error: uploadError } = await client.storage
      .from("backgrounds")
      .upload(
        `${client.auth.user().id}/backgroundImage.${extFile}?bust=${Date.now()}`,
        fileBg,
        {
          cacheControl: "3600",
          upsert: true,
        }
      );

    if (uploadError) throw uploadError;

    const { publicURL, error } = client.storage
      .from("backgrounds")
      .getPublicUrl(
        `${client.auth.user().id}/backgroundImage.${extFile}?bust=${Date.now()}`
      );

    const { error: updateError } = await client
      .from("profiles")
      .update({
        updated_at: new Date(),
        background_url: publicURL,
      })
      .match({ id: client.auth.user().id });

    if (updateError) throw updateError;
    emit("updateBackground", publicURL);

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
      .remove([`${client.auth.user().id}/backgroundImage.${"jpg" || "jpeg" || "png"}`]);

    if (removeError) throw removeError;

    const { user, error: updateError } = await client.auth.update({
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
      .match({ id: client.auth.user().id });

    if (error) throw error;

    emit("updateBackground", null);
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
  <div>
    <div
      v-if="backgroundUrl"
      :style="{
        background: `url(${backgroundUrl}) no-repeat center `,
        backgroundSize: 'cover',
      }"
      class="background"
    ></div>

    <div class="background-btns">
      <input
        ref="file"
        :disabled="isLoading"
        id="uploadBackground"
        type="file"
        @change="updateBackground"
        accept="image/png, image/jpeg, image/jpg"
        hidden
      />
      <label for="uploadBackground" class="upload">
        <span v-show="isLoading" class="loading-spinner"></span>
        <span v-show="isLoading">Dodawanie tła</span>

        <span v-show="!isLoading">{{ !backgroundUrl ? "Dodaj" : "Zmień" }}</span>
      </label>
      <button
        :disabled="isLoading"
        v-if="backgroundUrl"
        @click.prevent="removeBackground"
        class="btn-gray"
      >
        Usuń
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background {
  width: 100%;
  height: 12.5rem;
  border-radius: 1.5rem;

  &-btns {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
}
</style>
