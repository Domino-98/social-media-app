<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";

const validURL = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

const pinSchema = yup.object({
  title: yup.string().required("Tytuł jest wymagany"),
  destination_url: yup.lazy((value) =>
    !value ? yup.string() : yup.string().matches(validURL, "Adres URL jest nieprawidłowy")
  ),
  category: yup.string().required("Wybierz kategorię"),
});

const toast = useToast();
const user = useSupabaseUser();
const client = useSupabaseClient();
const userProfile = useUser();

let imgFile = ref<File>();
let isLoading = ref<boolean>();

const handlePinSubmit = async (values) => {
  const { title, description, destination_url, category } = values;
  isLoading.value = true;
  try {
    if (imgFile.value) {
      const { error: uploadError } = await client.storage
        .from("pins")
        .upload(`${client.auth.user().id}/${imgFile.value.name}`, imgFile.value);

      if (uploadError) throw new Error("Wystąpił błąd podczas przesyłania pliku");

      const { publicURL, error } = client.storage
        .from("pins")
        .getPublicUrl(`${client.auth.user().id}/${imgFile.value.name}`);

      if (error) throw new Error("Wystąpił błąd podczas pobierania adresu URL");

      console.log(publicURL);

      const { error: insertError } = await client.from("pins").insert({
        title: title,
        description: description,
        pin_url: publicURL,
        destination_url: destination_url,
        category: category,
        user_id: client.auth.user().id,
      });

      if (insertError) throw new Error("Wystąpił błąd podczas dodawania obrazu");

      toast("Pomyślnie dodano pina!");
      return navigateTo("/");
    } else {
      toast("Do utworzenia Pina wymagany jest obraz", {
        type: TYPE.ERROR,
      });
    }
  } catch (error) {
    toast(error.message, {
      type: TYPE.ERROR,
    });
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: "navigation",
  middleware: "auth",
});
</script>

<template>
  <main>
    <div class="add">
      <VForm @submit="handlePinSubmit" :validation-schema="pinSchema" class="add__form">
        <PinUpload @update-file="(file) => (imgFile = file)" />

        <div class="add__form-info">
          <div class="add__form-group">
            <VField
              v-slot="{ field, errors }"
              label="tytuł"
              name="title"
              :validateOnBlur="false"
            >
              <input
                v-bind="field"
                class="add__form-input add__form-input--big"
                type="text"
                placeholder="Dodaj tytuł"
                :class="{ invalid: errors[0] }"
              />
              <span class="error">{{ errors[0] }}</span>
            </VField>
          </div>
          <div class="add__form-profile">
            <img
              class="add__form-profile-img"
              :src="user?.user_metadata.avatar_to_display"
              alt=""
            />
            <span class="add__form-profile-name">{{ userProfile.username }}</span>
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
                v-bind="field"
                class="add__form-input"
                type="text"
                placeholder="Dodaj link docelowy"
                :class="{ invalid: errors[0] }"
              />
            </VField>
            <VErrorMessage name="destination_url" class="error" />
          </div>
          <div class="add__form-group">
            <label for="" class="add__form-label">Wybierz kategorię pina</label>
            <VField
              name="category"
              as="select"
              :validateOnBlur="false"
              class="add__form-select"
            >
              <option value="" selected disabled>Wybierz kategorię</option>
              <option value="cars">Samochody</option>
              <option value="fitness">Fitness</option>
              <option value="wallpapers">Tapety</option>
              <option value="food">Jedzenie</option>
              <option value="nature">Natura</option>
              <option value="art">Sztuka</option>
              <option value="web-designs">Web designs</option>
              <option value="travels">Podróże</option>
              <option value="quotes">Cytaty</option>
              <option value="cats">Koty</option>
              <option value="dogs">Psy</option>
            </VField>
            <font-awesome-icon icon="fa-solid fa-chevron-down" />
          </div>
          <VErrorMessage name="category" class="error" />
          <button :disabled="isLoading" class="add__form-save">
            <span v-show="isLoading" class="loading-spinner"></span>
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
      margin-top: 1rem;

      &:nth-child(4) {
        margin-top: auto;
      }

      &:nth-child(5) {
        position: relative;
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

    &-select {
      display: block;
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.5rem;
      border: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      background-color: var(--bg-color-primary);
      color: var(--font-color);
      font-size: 1rem;
      -webkit-appearance: none;
      appearance: none;
      outline: none;

      & option {
        padding: 0 0.25rem;
      }
    }

    &-save {
      align-self: end;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 2rem;
      background-color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 500;
      color: #eee;
      cursor: pointer;

      &:hover {
        background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
      }
    }
  }
}

.invalid {
  border-bottom: 2px solid #ff5151 !important;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

button:disabled {
  cursor: not-allowed;
  filter: grayscale(50%);
}
</style>
