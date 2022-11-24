<script setup lang="ts">
import { Pin } from "~~/models/pin";

const props = defineProps<{
  pin: Pin;
}>();

const homeURL = window.location.origin;
const copyInput = ref<HTMLInputElement>();
const copied = ref<boolean>(false);

console.log({ homeURL, copyInput, copied });

const copyURL = () => {
  copyInput.value?.select();
  copyInput.value?.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyInput.value?.value!);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};
</script>

<template>
  <div class="share">
    <div
      @click.prevent="copyURL"
      v-tippy="{ placement: 'right' }"
      content="Skopiuj"
      class="share__copy"
    >
      <input
        ref="copyInput"
        class="share__copy-input"
        type="text"
        :value="`${homeURL}/pin/${pin.id}`"
        disabled
      />
      <font-awesome-icon
        icon="fa-solid fa-copy"
        size="xl"
        class="share__copy-icon"
      />
    </div>

    <p v-if="copied" class="share__copied">Skopiowano!</p>

    <div class="share__social">
      <ShareNetwork
        class="share__fb"
        network="facebook"
        :url="`${homeURL}/pin/${pin.id}`"
        :title="pin.title"
        description="Hej, popatrz na ten obrazek!"
        hashtags="graphics"
      >
        <font-awesome-icon
          icon="fa-brands fa-facebook-square"
          :style="{ color: 'white' }"
          size="xl"
        />
        <span>Facebook</span>
      </ShareNetwork>

      <ShareNetwork
        class="share__twitter"
        network="twitter"
        :url="`${homeURL}/pin/${pin.id}`"
        :title="pin.title"
        description="Hej, popatrz na ten obrazek!"
        hashtags="graphics"
      >
        <font-awesome-icon
          icon="fa-brands fa-twitter"
          :style="{ color: 'white' }"
          size="xl"
        />
        <span>Twitter</span>
      </ShareNetwork>

      <ShareNetwork
        class="share__whatsapp"
        network="whatsapp"
        :url="`${homeURL}/pin/${pin.id}`"
        :title="pin.title"
        description="Hej, popatrz na ten obrazek!"
        hashtags="graphics"
      >
        <font-awesome-icon
          icon="fa-brands fa-whatsapp"
          :style="{ color: 'white' }"
          size="xl"
        />
        <span>WhatsApp</span>
      </ShareNetwork>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.share {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;

  &__copy {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;

    &-input {
      flex: 1;
      padding: 0.75rem;
      padding-right: 2rem;
      border-radius: 0.25rem;
      background-color: rgba(var(--opacity-color), 0.1);
      color: var(--font-color);
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
    }

    &-icon {
      position: absolute;
      right: 0.5rem;
      color: var(--icon-color);
    }
  }

  &__copied {
    align-self: center;
    background-color: rgba(var(--opacity-color), 0.1);
    padding: 0.5rem;
    border-radius: 0.25rem;
    color: var(--font-color);
  }

  &__social {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__fb {
    background-color: #4267b2;
  }

  &__twitter {
    background-color: #1da1f2;
  }

  &__whatsapp {
    background-color: #25d366;
  }

  &__fb,
  &__twitter,
  &__whatsapp {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    color: #fff;
  }
}
</style>
