<template>
  <div class="min-h-screen m-0 bg-gray-900 flex items-center justify-center px-4">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md  p-6 rounded-lg space-y-6"
    >
      <!-- Logo -->
      <img src="/logo.png" alt="logo" class="w-24 mx-auto" />

      <!-- Login Text -->
      <div class="text-center text-white space-y-2">
        <h2 class="text-2xl font-bold">Sign in to your account!</h2>
        <p class="text-gray-400">
          Or
          <RouterLink to="/register" class="text-purple-400 hover:underline">
            register for a new account
          </RouterLink>
        </p>
      </div>

      <!-- Inputs -->
      <input
        v-model="email"
        type="email"
        name="email"
        id="email"
        placeholder="Email address"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        v-model="password"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <!-- Remember me & Forgot Password -->
      <div class="flex justify-between items-center text-sm text-gray-400">
        <label class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember-me"
            class="text-purple-600 focus:ring-purple-500 rounded"
          />
          <span>Remember me</span>
        </label>
        <RouterLink
          to="/forgot-password"
          class="text-purple-400 hover:underline"
        >
          Forgot your password?
        </RouterLink>
      </div>

      <!-- Buttons -->
      <button
        @click="login()"
        class="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
      >
        Sign in
      </button>
      <button
        @click="loginAsGuest()"
        class="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300"
      >
        Sign in as Guest
      </button>

      <!-- Alert Component -->
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Alert from "../components/Alert.vue";
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
};

const login = async () => {
  try {
    const res = await loginUser(email.value, password.value);
    showAlert(res.message, "info");
    user.value = res.user;
    token.value = res.token;
    setLocalStorage();
    router.go("/");
  } catch (err) {
    showAlert(err.response.data.message);
  }
};

const loginAsGuest = async () => {
  try {
    const res = await loginUser("guest@gmail.com", "123456");
    showAlert(res.message, "info");
    user.value = res.user;
    token.value = res.token;
    setLocalStorage();
    router.go("/");
  } catch (err) {
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
</style>
