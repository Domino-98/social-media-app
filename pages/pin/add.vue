<script setup lang="ts">
let file = ref();
let fileupload = ref();

const uploadFile = (e) => {
  if (e.target.files[0]) {
    file.value = e.target.files[0];
    console.log(file.value);
    file.value.fileUrl = URL.createObjectURL(file.value);
    console.log(file.value);
  }
};

const dragFile = (e) => {
  if (e.dataTransfer.files[0]) {
    file.value = e.dataTransfer.files[0];
    console.log(file.value);
    file.value.fileUrl = URL.createObjectURL(file.value);
  }
};

const deleteFile = () => {
  console.log(fileupload.value.value);
  file.value = null;
  fileupload.value.value = "";
};

definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <div class="add">
    <form class="add__form">
      <div class="add__form-photo">
        <div v-if="file" class="add__form-photo-img">
          <img :src="file.fileUrl" />
          <button @click.prevent="deleteFile" class="add__form-photo-delete">
            <span class="material-icons md-18">delete</span>
          </button>
        </div>
        <div v-else @drop="dragFile" class="add__form-photo-upload">
          <span class="material-icons-outlined md-30">cloud_upload</span>
          <p class="add__form-photo-info">
            Przeciągnij i upuść lub kliknij, aby przesłać
          </p>
        </div>
        <input ref="fileupload" type="file" @change="uploadFile" />
      </div>
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
            src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80"
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
          <label for="" class="add__form-label">Wybierz kategorię</label>
          <select class="add__form-select" name="" id="">
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
</template>

<style lang="scss" scoped>
.add {
  display: flex;
  width: 100%;
  max-width: 55rem;
  margin: 0.5rem auto;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--bg-color-secondary);
  color: var(--font-color);

  &__form {
    display: flex;
    width: 100%;

    &-photo {
      position: relative;
      flex: 2;
      height: 100%;
      margin-right: 2rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background-color: rgba(var(--opacity-color), 0.075);

      &-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        border: 2px dashed rgba(var(--opacity-color), 0.2);
        border-radius: 0.5rem;
      }

      &-delete {
        z-index: 10;
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: var(--bg-color-secondary);
        color: #252525;
        cursor: pointer;

        &:hover span {
          color: var(--primary-color);
        }
      }

      &-img {
        position: relative;
        height: 100%;
      }

      &-info {
        width: 80%;
        margin-top: 0.5rem;
        color: var(--font-color);
        text-align: center;
        font-size: 0.9rem;
      }

      & input {
        position: absolute;
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        cursor: pointer;

        &::-webkit-file-upload-button {
          cursor: pointer;
        }
      }

      & img {
        border-radius: 0.5rem;
      }
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
        max-width: 15rem;
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
