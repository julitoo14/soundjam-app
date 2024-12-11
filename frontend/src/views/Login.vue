<template>
  <div class="page">
    <form v-on:submit.prevent="onSubmit">
      <img src="/logo.png" alt="logo" class="logo" />
      <div class="login-text">
        <h2 class="text-center">Sign in to your account!</h2>
        <span class="text-center">Or <RouterLink to="/register" class="link">register for a new account </RouterLink></span>
      </div>

        <input
          v-model="email"
          type="email"
          name="email"
          id="email"
          class="form-control"
          placeholder="Email address"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="form-control "
          id="password"
        />

      <div class="remember-forgot">
        <div>
          <input type="checkbox" value="remember-me" id="remember-me" class="remember-input">
          <label class="remember-text" for="remember-me">Remember me</label>
        </div>
        <RouterLink to="/forgot-password" class="link">Forgot your password?</RouterLink>
      </div>


      <button
        @click="login()"
        class="sign-btn"
      >
        Sign in
      </button>
    <button
      @click="loginAsGuest()"
      class="sign-btn"
    >
      Sign in as Guest
    </button>

      <Alert
        :type="alert.type"
        :message="alert.message"
        :show="alert.show"
        @close="alert.show = false"
      />
    </form>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import Alert from "../components/Alert.vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../composables/apiServices";
const email = ref("");
const password = ref("");
const router = useRouter();
const user = ref({});
const token = ref("");
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const setLocalStorage = () => {
  localStorage.setItem("token", token.value);
  localStorage.setItem("nick", user.value.nick);
  localStorage.setItem("id", user.value._id);
  localStorage.setItem("image", user.value.image);
}

const login = async () => {
  try{
    const res = await loginUser(email.value, password.value);
    showAlert(res.message, "info");
    console.log(res)
    user.value = res.user;
    token.value = res.token;
    setLocalStorage();
    router.go('/');
  }catch(err){
    showAlert(err.response.data.message);
  }  
};

const loginAsGuest = async () => {
  try{
    const res = await loginUser('guest@gmail.com', '123456');
    showAlert(res.message, "info");
    user.value = res.user;
    token.value = res.token;
    setLocalStorage();
    router.go('/');
  }catch(err){
    showAlert(err.response.data.message);
  }
};

onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push("/");
  }
});
</script>

<style scoped>

form {
  width: 40%;
  padding: 2em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.form-control{
  background-color: var(--background-color);
  color: var(--text-color);
}

.form-control::placeholder{
  color: var(--muted-text-color);
}

.form-control:focus{
  border-color: var(--primary-color);
  outline: none;
}

.login-text{
  display: flex;
  flex-direction: column;
}

.page{
  height: 100vh;
  background: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.link{
  color: var(--primary-color);
  text-decoration: none;
}

.logo{
  width: 100px;
  margin: auto;
  display: block;
}

.remember-forgot{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-text{
  margin-left: 0.5em;
  color: var(--muted-text-color);
}

.remember-input {
  background-color: var(--background-color);
}

.sign-btn{
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 0.5em;
  cursor: pointer;
  border-radius: 5px;
}


@media screen and (max-width: 1000px) {
  form {
    width: 70%;
  }

  .page{
    align-items: flex-start;
    justify-content: center;
  }

  .remember-forgot{
    flex-direction: column;
    gap: 1em;
    justify-content: flex-start;
    align-items: flex-start;
  }
}



</style>
