<script setup lang="ts">
import { useToast } from "vue-toastification";
import { TYPE } from "vue-toastification";
import mime from "mime-types";

const emit = defineEmits<{
  (e: "updateFile", value: File): void;
}>();

const toast = useToast();

let file = ref<File>();
let fileInput = ref<HTMLInputElement>();
let urlInput = ref<HTMLInputElement>();
let urlInputVisible = ref<boolean>(false);
let isLoading = ref<boolean>(false);
let givenUrl = ref<string>("");
let imgUrl = ref<string>("");

const validateFileSize = (file: File, maxSizeMb: number): boolean => {
  const fileSize = file.size;
  const fileMb = fileSize / 1024 ** 2;

  if (fileMb > maxSizeMb) {
    return false;
  }
  return true;
};

const uploadFile = (e: Event) => {
  let input = e.target as HTMLInputElement;

  if (input.files[0]) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!allowedExtensions.exec(input.value)) {
      return toast("Akceptowalne są tylko pliki o rozszerzeniach JPG/JPEG, PNG, GIF", {
        type: TYPE.ERROR,
      });
    }

    if (!validateFileSize(input.files[0], 20)) {
      return toast("Maksymalna wielkość pliku to 20MB", {
        type: TYPE.ERROR,
      });
    }

    file.value = input.files[0];
    imgUrl.value = URL.createObjectURL(file.value);

    emit("updateFile", file.value);
  }
};

const deleteFile = () => {
  file.value = null;
  fileInput.value.value = "";
  givenUrl.value = "";
  imgUrl.value = "";
  urlInputVisible.value = false;
};

const validWebsite = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const regex = new RegExp(validWebsite);

async function getFileFromUrl(url, defaultType = "image/jpeg") {
  isLoading.value = true;
  try {
    if (!url.match(regex)) throw new Error("Wprowadź poprawny adres URL obrazu");
    const response = await fetch(url);
    const data = await response.blob();

    if (
      !(
        data.type === "image/jpeg" ||
        data.type === "image/png" ||
        data.type === "image/gif"
      )
    )
      throw new Error("Akceptowalne są tylko pliki o rozszerzeniach JPG/JPEG, PNG, GIF");

    let randomId = Math.floor(Math.random() * Date.now());
    let ext = mime.extension(data.type);
    let file = new File([data], `image${randomId}.${ext}`, {
      type: data.type || defaultType,
    });

    if (!validateFileSize(file, 20)) {
      throw new Error("Maksymalna wielkość pliku to 20MB");
    }

    imgUrl.value = url;
    emit("updateFile", file);
  } catch (error) {
    toast(error.message, {
      type: TYPE.ERROR,
    });
  } finally {
    isLoading.value = false;
  }
}

const handleEditionMode = () => {
  urlInputVisible.value = true;
  nextTick(() => {
    urlInput.value.focus();
  });
};
</script>

<template>
  <div class="upload-container">
    <div class="upload-box">
      <div v-if="imgUrl" class="upload-img">
        <img :src="imgUrl" />
        <button @click.prevent="deleteFile" class="upload-delete">
          <span class="material-icons md-24">delete</span>
        </button>
      </div>

      <div v-else class="upload-content">
        <span class="material-icons-outlined md-30">cloud_upload</span>
        <p class="upload-text">Przeciągnij i upuść lub kliknij, aby przesłać</p>
        <p class="upload-text upload-text--mobile">Prześlij zdjęcie / gif</p>
        <p class="upload-info">
          Zalecenie: Użyj wysokiej jakości obrazów o rozmiarze mniejszym niż 20MB
        </p>
      </div>
      <input
        ref="fileInput"
        type="file"
        @change="uploadFile"
        accept="image/gif, image/jpeg, image/png"
      />
    </div>

    <button v-show="!urlInputVisible" @click.prevent="handleEditionMode" class="url-btn">
      Zapisz ze strony
    </button>
    <div v-show="urlInputVisible" class="url-container">
      <input
        ref="urlInput"
        v-model="givenUrl"
        @keyup.enter="getFileFromUrl(givenUrl)"
        @focusout="!givenUrl ? (urlInputVisible = false) : null"
        @keydown.enter="!givenUrl ? (urlInputVisible = false) : null"
        type="text"
        class="url-input"
      />
      <button @click.prevent="getFileFromUrl(givenUrl)" class="url-search">
        <span v-show="isLoading" class="loading-spinner"></span>
        <span v-show="!isLoading" class="material-icons-outlined md-30"
          >image_search</span
        >
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload {
  &-container {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &-box {
    position: relative;
    height: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background-color: rgba(var(--opacity-color), 0.075);

    @media only screen and (max-width: 62.5em) {
      margin-right: 0;
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

  &-img {
    position: relative;
    height: 100%;
  }

  &-delete {
    z-index: 10;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: var(--bg-color-secondary);
    color: #252525;
    cursor: pointer;

    &:hover span {
      color: var(--primary-color);
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 1rem;
    border: 2px dashed rgba(var(--opacity-color), 0.2);
    border-radius: 0.5rem;
  }

  &-text {
    margin-top: 0.5rem;
    color: var(--font-color);
    text-align: center;
    font-size: 0.9rem;

    @media only screen and (max-width: 37.5em) {
      display: none;
    }

    &--mobile {
      display: none;

      @media only screen and (max-width: 37.5em) {
        display: block;
      }
    }
  }

  &-info {
    position: absolute;
    bottom: 2rem;
    padding: 0 2rem;
    text-align: center;
    font-size: 0.8rem;
    color: rgba(var(--opacity-color), 0.5);

    @media only screen and (max-width: 62.5em) {
      position: static;
      margin-top: 0.5rem;
      padding: 0;
    }
  }
}

.url {
  &-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 2rem;
    background-color: rgba(var(--opacity-color), 0.075);
    font-weight: 500;
    text-align: center;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: rgba(var(--opacity-color), 0.15);
    }
  }
  &-container {
    display: flex;
    border-radius: 2rem;
  }
  &-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 2rem 0 0 2rem;
    background-color: rgba(var(--opacity-color), 0.075);
    font-weight: 500;
    font-size: 1rem;
  }
  &-search {
    min-width: 3.5rem;
    padding: 0 1rem;
    border-radius: 0 2rem 2rem 0;
    background-color: rgba(var(--opacity-color), 0.15);
    cursor: pointer;

    &:hover {
      background-color: rgba(var(--opacity-color), 0.2);
    }
  }
}

.loading-spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(var(--opacity-color), 0.3);
  border-top-color: var(--icon-color);
}
</style>