<script setup lang="ts">
type AuthState = "login" | "register";

let authState = ref<AuthState>("login");

const toggleAuthState = (state: AuthState) => {
  authState.value = state;
};
</script>

<template>
  <main class="auth-container">
    <video id="background-video" autoplay loop muted>
      <source src="~/assets/background.mp4" type="video/mp4" />
    </video>
    <NuxtLink to="/" class="logo">
      <span class="material-icons-outlined md-42">camera</span>
      <h1 class="logo-text">We<span>Share</span></h1>
    </NuxtLink>
    <div class="auth">
      <AuthLogin v-if="authState === 'login'" @auth-state="toggleAuthState" />
      <AuthRegister v-else @auth-state="toggleAuthState" />
    </div>
  </main>
</template>

<style lang="scss">
@mixin providers($color) {
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
  transition: all 0.3s;

  &:hover {
    background-color: darken($color, 15%);
  }
}

#background-video {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  filter: brightness(50%);
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media only screen and (max-width: 37.5em) {
    margin: 0 1rem;
  }
}

.auth {
  max-width: 22.5rem;
  width: 100%;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
  background-color: var(--bg-color-secondary);

  &__header {
    margin-bottom: 1.5rem;
    font-family: "Rubik", "sans-serif";
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--heading-color);
    text-transform: uppercase;
  }

  &__form {
    &-group {
      position: relative;
      display: flex;
      flex-direction: column;

      &:not(:first-child) {
        margin-top: 1rem;
      }

      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }

      & .icon {
        position: absolute;
        left: 0.5rem;
        top: 0.7rem;
        pointer-events: none;
        color: var(--icon-color);

        &--visibility {
          left: unset;
          right: 0.5rem;
          top: 0.7rem;
          pointer-events: all;
        }
      }
    }

    &-label {
      position: absolute;
      top: 0.7rem;
      left: 2rem;
      transition: all 0.3s;
      font-size: 0.9rem;
      color: #909090;
      pointer-events: none;
    }

    &-input {
      transition: all 0.3s;
      padding: 0.6rem 0.25rem;
      padding-left: 2rem;
      padding-right: 2rem;
      border-radius: 0.25rem;
      background-color: var(--bg-color-primary);
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
      color: var(--font-color);
      font-family: inherit;

      &:focus + span {
        color: var(--primary-color);
      }

      &:focus ~ label,
      &:not(:placeholder-shown) ~ label {
        top: -1.1rem;
        left: 0.5rem;
        font-size: 0.8rem;
        color: var(--font-color);
      }
    }

    &-btn {
      display: block;
      transition: all 0.3s;
      width: 100%;
      margin: 1rem auto;
      padding: 0.6rem 0;
      border: 2px solid var(--primary-color);
      border-radius: 2rem;
      background-color: var(--primary-color);
      color: #fff;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.8rem;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: transparent;
        color: var(--primary-color);
      }
    }
  }

  &__forgot {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: var(--font-color);
    text-align: end;
    cursor: pointer;
  }

  &__providers {
    margin-top: 0.5rem;
    text-align: center;

    &-text {
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: var(--font-color);
      text-align: center;
    }

    &-google {
      margin-right: 0.5rem;
      background-color: #db4437;
      @include providers(#db4437);
    }

    &-facebook {
      background-color: #1877f2;
      @include providers(#1877f2);
    }
  }

  &__signup {
    text-align: center;

    &-text {
      margin-bottom: 0.5rem;
      margin-top: 1rem;
      font-size: 0.8rem;
      color: var(--font-color);
      text-align: center;
    }

    &-switch {
      transition: all 0.3s;
      font-size: 1rem;
      color: var(--font-color);
      text-align: center;
      text-transform: uppercase;
      font-family: "Rubik", "sans-serif";
      cursor: pointer;

      &:hover {
        color: var(--primary-color);
      }
    }
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;

  & span {
    color: #f0e1ff;
  }

  &-text {
    font-family: "Rubik", "sans-serif";
    font-size: 1.8rem;
    color: var(--primary-color);
    font-weight: 500;

    & span {
      color: #f0e1ff;
    }
  }
}

button:disabled,
button[disabled] {
  cursor: not-allowed;
  filter: grayscale(50%);
}

.error {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #ff4040;
}
</style>
