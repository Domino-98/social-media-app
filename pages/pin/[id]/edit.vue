<script setup lang="ts">
import * as yup from "yup";
import type { Pin, PinToUpdate } from "~~/models/pin";
import { useToast } from "vue-toastification";
import pinsApi from "~~/services/api_pins";
import categoriesApi from "~~/services/api_categories";

const emit = defineEmits<{
  (e: "update", value: PinToUpdate): void;
}>();

const pin = ref<Pin>();
const user = useSupabaseUser();
console.log(pin);

const toast = useToast();
const validURL =
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

const pinSchema = yup.object({
  title: yup.string().required("Tytuł jest wymagany"),
  destination_url: yup.lazy((value) =>
    !value
      ? yup.string()
      : yup.string().matches(validURL, "Adres URL jest nieprawidłowy")
  ),
  category_id: yup.string().required("Wybierz kategorię"),
});

const route = useRoute();
const pinId = route.params.id;
const isEditing = ref<boolean>(false);

const handlePinEdit = async (values: any) => {
  let { title, description, destination_url, category_id } = values;

  description ||= "";
  destination_url ||= "";

  const id = pin.value?.id;

  const pinToUpdate = {
    title,
    description,
    destination_url,
    category_id,
  } as PinToUpdate;

  isEditing.value = true;
  try {
    await pinsApi().editPin(id!, pinToUpdate);
    emit("update", pinToUpdate);
    const { pin: actualPin } = usePins();
    actualPin.value = { ...actualPin.value, ...pin.value } as Pin;
    toast("Pomyślnie zaktualizowano Pina");
  } catch (error) {
    console.error(error);
  } finally {
    isEditing.value = false;
    await navigateTo({ name: "pin-id", params: { id: `${pin.value?.id}` } });
  }
};

const closeModal = async () => {
  await navigateTo({ name: "pin-id", params: { id: `${pin.value?.id}` } });
};

const modalOpened = ref(route.name === "pin-id-edit");
const isLoading = ref<boolean>(false);

const getPin = async () => {
  isLoading.value = true;
  try {
    const fetchedPin = await pinsApi().fetchPinById(+pinId);
    pin.value = fetchedPin as Pin;
    console.log(fetchedPin);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const { categories } = useCategories();

const getCategories = async () => {
  try {
    const fetchedCategories = await categoriesApi().fetchCategories();
    categories.value = fetchedCategories;
  } catch (error) {
    if (error instanceof Error) console.error(error);
  }
};

const idString = computed(() => pin.value?.category?.id.toString());

onMounted(async () => {
  await getPin();
  await getCategories();
  if (pin.value?.author?.id !== user.value?.id)
    await navigateTo({ name: "pin-id", params: { id: `${pin.value?.id}` } });
});

definePageMeta({
  key: (route) => route.fullPath,
});
</script>

<template>
  <BaseModal v-if="pin" :open="modalOpened" @close="closeModal">
    <template #header>Edycja Pina</template>
    <template #body>
      <VForm
        @submit="handlePinEdit"
        :validation-schema="pinSchema"
        class="edit__form"
      >
        <BaseInput
          v-model="pin.title"
          name="title"
          label="Tytuł"
          id="title"
          type="text"
        />
        <BaseInput
          v-model="pin.description"
          name="description"
          label="Opis"
          id="description"
          type="text"
        />
        <BaseInput
          v-model="pin.destination_url"
          name="destination_url"
          label="Link docelowy"
          id="destination"
          type="text"
        />

        <BaseSelect
          v-model="idString"
          label="Kategoria"
          name="category_id"
          id="category"
        >
          <template #options>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </template>
        </BaseSelect>

        <div class="edit__form-btns">
          <button
            @click.prevent="closeModal"
            type="submit"
            class="btn btn--outline"
          >
            Zamknij
          </button>
          <button type="submit" :disabled="isEditing" class="btn btn--primary">
            <span
              v-show="isEditing"
              class="loading-spinner loading-spinner--light"
            ></span>
            <span>{{ isEditing ? "Zapisywanie Pina" : "Zapisz Pina" }}</span>
          </button>
        </div>
      </VForm>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.edit {
  &__form {
    &-btns {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
  }
}

.form {
  &__group {
    &:first-child {
      margin-top: 0;
    }
  }
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}
</style>
