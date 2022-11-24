<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import pinsApi from "~~/services/api_pins";
import categoriesApi from "~~/services/api_categories";

const validURL =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const pinSchema = yup.object({
  title: yup.string().required("Tytuł jest wymagany"),
  destination_url: yup.lazy((value) =>
    !value
      ? yup.string()
      : yup.string().matches(validURL, "Adres URL jest nieprawidłowy")
  ),
  category_id: yup.string().required("Wybierz kategorię"),
});

const toast = useToast();
const user = useSupabaseUser();
const userProfile = useUser();

const imgFile = ref<File>();
const isLoading = ref<boolean>();

const handlePinSubmit = async (values: any) => {
  console.log({ values });
  const { title, description, destination_url, category_id } = values;
  isLoading.value = true;
  try {
    if (imgFile.value) {
      await pinsApi().addPin(
        imgFile.value,
        title,
        description,
        destination_url,
        category_id
      );

      toast("Pomyślnie dodano pina!");
      return navigateTo("/");
    } else {
      toast("Do utworzenia Pina wymagany jest obraz", {
        type: TYPE.ERROR,
      });
    }
  } catch (error) {
    if (error instanceof Error)
      toast(error.message, {
        type: TYPE.ERROR,
      });
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
    console.error(error);
  }
};

onMounted(async () => {
  await getCategories();
});

definePageMeta({
  layout: "navigation",
  middleware: "auth",
});
</script>

<template>
  <main>
    <div class="add">
      <VForm
        @submit="handlePinSubmit"
        :validation-schema="pinSchema"
        class="add__form"
      >
        <PinUpload @update-file="(file: File) => (imgFile = file)" />

        <div class="add__form-info">
          <div class="add__form-group">
            <VField
              v-slot="{ field, errors }"
              label="title"
              name="title"
              :validateOnBlur="false"
            >
              <input
                v-bind="field"
                class="add__form-input add__form-input--big"
                type="text"
                placeholder="Dodaj tytuł"
                :class="{ invalid: errors.length }"
              />
              <VErrorMessage name="title" class="error" />
            </VField>
          </div>
          <div class="add__form-profile">
            <img
              class="add__form-profile-img"
              :src="
                user?.user_metadata.avatar_to_display ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              "
              alt=""
            />
            <span class="add__form-profile-name">{{
              userProfile?.username
            }}</span>
          </div>
          <div class="add__form-group">
            <VField
              name="description"
              class="add__form-input"
              type="text"
              placeholder="O czym jest twój pin?"
            />
          </div>
          <div class="add__form-group">
            <VField v-slot="{ field, errors }" name="destination_url">
              <input
                name="destination"
                v-bind="field"
                class="add__form-input"
                type="text"
                placeholder="Dodaj link docelowy"
                :class="{ invalid: errors.length }"
              />
            </VField>
            <VErrorMessage name="destination_url" class="error" />
          </div>

          <BaseSelect
            label="Wybierz kategorię pina"
            name="category_id"
            id="category"
          >
            <template #options>
              <option value="" selected disabled>Wybierz kategorię</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </template>
          </BaseSelect>

          <button type="submit" :disabled="isLoading" class="btn btn--primary">
            <span
              v-show="isLoading"
              class="loading-spinner loading-spinner--sm loading-spinner--light"
            ></span>
            <span>{{ isLoading ? "Zapisywanie Pina" : "Zapisz Pina" }}</span>
          </button>
        </div>
      </VForm>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 75em) {
    margin: 2rem;
  }

  @media only screen and (max-width: 50em) {
    margin: 0 1rem;
  }
}

.add {
  display: flex;
  width: 100%;
  max-width: 60rem;
  min-height: 70vh;
  margin-top: 0.5rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--bg-color-secondary);
  color: var(--font-color);

  @media only screen and (max-width: 37.5em) {
    padding: 1.5rem;
  }

  &__form {
    display: flex;
    gap: 1.5rem;
    width: 100%;

    @media only screen and (max-width: 62.5em) {
      flex-direction: column;
    }

    &-info {
      display: flex;
      flex-direction: column;
      flex: 3;
      height: 100%;
      min-height: 25rem;
      width: 100%;
    }

    &-profile {
      display: flex;
      align-items: center;
      margin-top: 1rem;

      &-name {
        margin-left: 0.5rem;
        font-weight: 500;
      }

      &-img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
    }

    &-group {
      position: relative;
      height: auto;
      margin-top: 1.25rem;

      &:nth-child(5) {
        align-self: flex-start;
        max-width: 20rem;
        width: 100%;

        & svg {
          position: absolute;
          right: 0.5rem;
          bottom: 0.5rem;
          pointer-events: none;
        }
      }
    }

    &-input {
      width: 100%;
      padding: 0.5rem 0.5rem;
      border-bottom: 2px solid rgba(var(--opacity-color), 0.1);
      color: var(--font-color);

      &--big {
        font-size: 1.6rem;
        font-weight: 500;
      }

      &:focus {
        border-bottom: 2px solid var(--primary-color);
      }
    }

    &-label {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--font-color);
    }
  }
}

.invalid {
  border-bottom: 2px solid #ff5151 !important;
}

.btn {
  align-self: flex-end;
  margin-top: auto;
}
</style>
