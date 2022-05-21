<script setup lang="ts">
definePageMeta({
  layout: "navigation",
});
</script>

<template>
  <main>
    <div class="settings">
      <h1 class="settings__header">Edycja profilu</h1>
      <form class="settings__form">
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Tło</label>
          <div class="settings__form-bg">
            <img
              src="https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170"
              alt=""
              class="settings__form-bg-img"
            />
            <div class="settings__form-bg-btns">
              <button class="settings__form-bg-btn">Zmień</button>
              <button class="settings__form-bg-btn">Usuń</button>
            </div>
          </div>
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Avatar</label>
          <div class="settings__form-avatar">
            <img
              src="https://www.coolgenerator.com/Pic/Face//male/male2016108666040345.jpg"
              alt=""
              class="settings__form-avatar-img"
            />
            <button class="settings__form-avatar-btn">Zmień</button>
          </div>
        </div>
        <div class="settings__form-name">
          <div class="settings__form-group">
            <label for="" class="settings__form-label">Imię</label>
            <input type="text" class="settings__form-input" />
          </div>
          <div class="settings__form-group">
            <label for="" class="settings__form-label">Nazwisko</label>
            <input type="text" class="settings__form-input" />
          </div>
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">O mnie</label>
          <textarea
            class="settings__form-input"
            id=""
            cols="20"
            rows="3"
            placeholder="Opowiedz coś o sobie"
          ></textarea>
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Nazwa użytkownika</label>
          <input type="text" class="settings__form-input" value="John" />
        </div>
        <div class="settings__form-group">
          <label for="" class="settings__form-label">Witryna / Portfolio</label>
          <input
            type="text"
            class="settings__form-input"
            placeholder="https://"
          />
        </div>
        <button class="settings__save-btn">Zapisz</button>
      </form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
}

.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 30rem;
  margin-top: 0.5rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--bg-color-secondary);

  @media only screen and (max-width: 37.5em) {
    padding: 1rem;
  }

  &__header {
    font-size: 1.6rem;
    font-weight: 500;
    font-family: "Rubik", "sans-serif";
    color: var(--heading-color);
  }

  &__form {
    align-self: start;
    width: 100%;

    &-bg {
      &-img {
        width: 100%;
        height: 12.5rem;
        border-radius: 2rem;
      }

      &-btns {
        display: flex;
        justify-content: space-between;
      }

      &-btn {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.9rem;
        background-color: var(--btn-bg);
        color: var(--btn-color);
        cursor: pointer;

        &:hover {
          background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
        }
      }
    }

    &-avatar {
      display: flex;
      align-items: center;

      &-img {
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 50%;
      }

      &-btn {
        margin-left: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.9rem;
        background-color: var(--btn-bg);
        color: var(--btn-color);
        cursor: pointer;

        &:hover {
          background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
        }
      }
    }

    &-name {
      display: flex;
    }

    &-group {
      display: flex;
      flex-direction: column;
      margin: 0 0.5rem;
      margin-top: 1rem;
    }

    &-label {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: var(--font-color);
    }

    &-input {
      transition: all 0.3s;
      width: 100%;
      padding: 0.5rem;
      border-radius: 1rem;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
      background-color: var(--bg-color-primary);
      color: var(--font-color);

      &:focus {
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      }
    }
  }

  &__save-btn {
    display: block;
    margin: 0 auto;
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 2rem;
    cursor: pointer;
    background-color: var(--primary-color);
    color: #eee;

    &:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
    }
  }
}
</style>
