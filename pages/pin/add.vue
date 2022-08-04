<script setup lang="ts">
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import { User } from "~~/models/user";

const toast = useToast();
const user = useSupabaseUser();
const client = useSupabaseClient();

let imgFile = ref<File>();

definePageMeta({
  layout: "navigation",
  middleware: "auth",
});
</script>

<template>
  <main>
    <div class="add">
      <form class="add__form">
        <PinUpload @update-file="(file) => (imgFile = file)" />

        <div class="add__form-info">
          <div class="add__form-group">
            <input
              class="add__form-input add__form-input--big"
              type="text"
              placeholder="Dodaj tytuł"
            />
          </div>
          <div class="add__form-profile">
            <img
              class="add__form-profile-img"
              :src="user?.user_metadata.avatar_to_display"
              alt=""
            />
            <span class="add__form-profile-name">John</span>
          </div>
          <div class="add__form-group">
            <input
              class="add__form-input"
              type="text"
              placeholder="O czym jest twój pin?"
            />
          </div>
          <div class="add__form-group">
            <input
              class="add__form-input"
              type="text"
              placeholder="Dodaj link docelowy"
            />
          </div>
          <div class="add__form-group">
            <label for="" class="add__form-label">Wybierz kategorię pina</label>
            <select class="add__form-select" name="" id="">
              <option value="" selected disabled>Wybierz kategorię</option>
              <option value="Samochody">Samochody</option>
              <option value="Fitness">Fitness</option>
              <option value="Tapety">Tapety</option>
              <option value="Jedzenie">Jedzenie</option>
              <option value="Natura">Natura</option>
              <option value="Sztuka">Sztuka</option>
              <option value="Web designs">Web designs</option>
              <option value="Podróże">Podróże</option>
              <option value="Cytaty">Cytaty</option>
              <option value="Koty">Koty</option>
              <option value="Psy">Psy</option>
            </select>
            <span class="material-icons-outlined">expand_more</span>
          </div>
          <button class="add__form-save">Zapisz Pina</button>
        </div>
      </form>
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

        & span {
          position: absolute;
          right: 0;
          bottom: 0;
          transform: scale(0.8);
          font-size: 2rem;
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
</style>
