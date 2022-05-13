<template>
  <div>
    <h1 class="auth__header">Zarejestruj się</h1>
    <form action="" class="auth__form">
      <div class="auth__form-group">
        <input
          type="text"
          id="name"
          class="auth__form-input"
          placeholder=" "
          required
        />
        <span class="material-icons-outlined md-18 icon">person</span>
        <label for="name" class="auth__form-label">Nazwa użytkownika</label>
      </div>
      <div class="auth__form-group">
        <input
          type="email"
          id="email"
          class="auth__form-input"
          placeholder=" "
          required
        />
        <span class="material-icons-outlined md-18 icon">email</span>
        <label for="email" class="auth__form-label">Email</label>
      </div>
      <div class="auth__form-group">
        <input
          type="password"
          id="password"
          class="auth__form-input"
          placeholder=" "
          required
        />
        <span class="material-icons-outlined md-18 icon">lock</span>
        <label for="password" class="auth__form-label">Hasło</label>
      </div>
      <div class="auth__form-group">
        <input
          type="password"
          id="password2"
          class="auth__form-input"
          placeholder=" "
          required
        />
        <span class="material-icons-outlined md-18 icon">lock</span>
        <label for="password2" class="auth__form-label">Powtórz hasło</label>
      </div>
      <button class="auth__form-btn">Zarejestruj się</button>
    </form>
    <p class="auth__providers-text">Lub zarejestruj się za pomocą</p>
    <div class="auth__providers">
      <svg
        class="auth__providers-google"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 32 32"
        width="40"
        height="40"
      >
        <path
          fill="#fff"
          d="M 16.003906 14.0625 L 16.003906 18.265625 L 21.992188 18.265625 C 21.210938 20.8125 19.082031 22.636719 16.003906 22.636719 C 12.339844 22.636719 9.367188 19.664063 9.367188 16 C 9.367188 12.335938 12.335938 9.363281 16.003906 9.363281 C 17.652344 9.363281 19.15625 9.96875 20.316406 10.964844 L 23.410156 7.867188 C 21.457031 6.085938 18.855469 5 16.003906 5 C 9.925781 5 5 9.925781 5 16 C 5 22.074219 9.925781 27 16.003906 27 C 25.238281 27 27.277344 18.363281 26.371094 14.078125 Z"
        ></path>
      </svg>
      <svg
        class="auth__providers-facebook"
        xmlns="http://www.w3.org/2000/svg"
        data-name="Layer 1"
        viewBox="0 0 24 24"
        width="40"
        height="40"
      >
        <path
          fill="#fff"
          d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z"
        />
      </svg>
    </div>
    <div class="auth__signup">
      <p class="auth__signup-text">Masz już konto?</p>
      <a @click="$emit('auth-state', 'login')" class="auth__signup-switch"
        >Zaloguj się</a
      >
    </div>
  </div>
</template>
