<template>
  <div class="min-h-screen m-0  bg-gray-900 flex items-center justify-center px-4">
    <form
      autocomplete="off"
      @submit.prevent="register"
      class="w-full max-w-md p-4 rounded-lg space-y-2 md:space-y-4"
    >
      <!-- Logo -->
      <img src="/logo.png" alt="logo" class="w-24 mx-auto" />

      <!-- Register Text -->
      <div class="text-center text-white space-y-2">
        <h2 class="text-2xl font-bold">Create your account!</h2>
        <p class="text-gray-400">
          Or
          <RouterLink to="/login" class="text-purple-400 hover:underline">
            login to your account
          </RouterLink>
        </p>
      </div>

      <!-- Inputs -->
      <input
        v-model="form.name"
        required
        type="text"
        id="name"
        placeholder="Name"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        v-model="form.surname"
        required
        type="text"
        id="surname"
        placeholder="Surname"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        v-model="form.nick"
        required
        type="text"
        id="nick"
        placeholder="Nick"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        v-model="form.email"
        required
        type="email"
        id="email"
        placeholder="Email address"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        v-model="form.password"
        required
        type="password"
        id="password"
        placeholder="Password"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      <input
        v-model="form.confirmPassword"
        required
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
        class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <!-- Register Button -->
      <button
        type="submit"
        class="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
      >
        Register
      </button>

      <!-- Alert -->
      <Alert
        :type="alert.type"
        :message="alert.message"
        :show="alert.show"
        @close="alert.show = false"
      />
    </form>
  </div>
</template>

---

### **Script**

```javascript
<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import Alert from "../components/Alert.vue";
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
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  } catch (err) {
    showAlert(err, "danger");
  }
};
</script>
