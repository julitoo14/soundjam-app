<template>
  <div class="page">
    <form autocomplete="off" v-on:submit.prevent="onSubmit">
      <img src="/logo.png" alt="logo" class="logo" />
      <div class="register-text">
        <h2 class="text-center">Create your account!</h2>
        <span class="text-center">Or <RouterLink to="/login" class="link">login to your account </RouterLink></span>
      </div>
        <input
          v-model="form.name"
          required
          type="name"
          class="form-control"
          id="name"
          placeholder="Name"
          autocomplete="off"
        />
        <input
          v-model="form.surname"
          required
          type="surname"
          class="form-control"
          id="surname"
          placeholder="Surname"
        />
        <input
          v-model="form.nick"
          required
          type="text"
          name="nick"
          id="nick"
          class="form-control"
          placeholder="Nick"
        />
        <input
          v-model="form.email"
          required
          type="email"
          name="email"
          id="email"
          class="form-control"
          placeholder="Email address"
        />
        <input
          v-model="form.password"
          required
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
        />
        <input
          v-model="form.confirmPassword"
          required
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Confirm Password"
        />
      <button
        @click="register()"
        class="register-btn"
      >
        Register
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
import {onMounted, reactive } from "vue";
import Alert from "../components/Alert.vue";
import { useRouter } from "vue-router";
import { saveUser } from "../composables/apiServices";

const router = useRouter();

const form = reactive({
  name: "",
  surname: "",
  nick: "",
  email: "",
  password: "",
  confirmPassword: "",
});

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

const validateForm = () => {
  for (let field in form) {
    if (!form[field]) {
      showAlert(`Please fill in the ${field}`, "danger");
      return false;
    }
  }
  if (form.password !== form.confirmPassword) {
    showAlert("Passwords do not match", "danger");
    return false;
  }
  return true;
};

const register = async () => {
  if (!validateForm()) return;

  try {
    const res = await saveUser(form);
    showAlert(res.message, "info");
    console.log(res);
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  } catch (err) {
    showAlert(err, "danger");
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

.form-control {
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

.register-text{
  display: flex;
  flex-direction: column;
}

.page{
  min-height: 100vh;
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

.register-btn{
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
    margin: auto;
  }

  .page{
    padding-top:5em;
  }
}


</style>
