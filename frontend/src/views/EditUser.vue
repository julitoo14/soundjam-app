<template>
  <div class="bg-gray-950 pt-2 pb-14 px-3 relative">
      <h1 class="text-center text-2xl text-white font-bold mb-2">Edit User</h1>
      <form @submit.prevent="submitForm" class="bg-gray-800 space-y-1 md:w-2/5 m-auto p-4 rounded-lg">
        <div v-for="field in fields" :key="field.id" class="space-y-1">
          <label :for="field.id" class="block text-white text-sm font-semibold">{{ field.label }}</label>
          <input
            :type="field.type"
            :id="field.id"
            v-model="field.model.value"
            :required="field.required"
            class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>

        <div class="">
          <label for="file0" class="block text-white text-sm font-semibold">Image:</label>
          <input
            id="file0"
            name="file0"
            type="file"
            @change="handleFileUpload"
            class="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>

        <div class="flex justify-start space-x-4 mt-4">
          <button
            type="submit"
            class="bg-purple-600 hover:bg-purple-700 text-white font-semibold  p-2 rounded-md transition"
          >
            Save
          </button>

          <RouterLink
            :to="`/profile/${route.params.id}`"
            class="bg-gray-700 hover:bg-gray-600 text-white font-semibold p-2 rounded-md transition"
          >
            Back
          </RouterLink>
        </div>
      </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { uploadUserImage, updateUser, getUserProfile } from "../composables/apiServices";

const user = ref("");
const file0 = ref();
const router = useRouter();
const route = useRoute();
const name = ref("");
const surname = ref("");
const nick = ref("");
const email = ref("");
const password = ref("");
const userId = route.params.id;

const fields = [
  { id: "name", label: "Name:", model: name, type: "text", required: true },
  { id: "surname", label: "Surname:", model: surname, type: "text", required: true },
  { id: "nick", label: "Nick:", model: nick, type: "text", required: true },
  { id: "email", label: "Email:", model: email, type: "email", required: true },
  { id: "password", label: "Password:", model: password, type: "password", required: false },
];

onMounted(async () => {
  const response = await getUserProfile(userId);
  if (response.status === "success") {
    user.value = response.user;
    name.value = user.value.name;
    surname.value = user.value.surname;
    nick.value = user.value.nick;
    email.value = user.value.email;
    password.value = user.value.password;
  } else {
    console.log(response.message);
  }
});

const handleFileUpload = (event) => {
  file0.value = event.target.files[0];
};

const uploadImage = async () => {
  if (file0.value) {
    try {
      let formData = new FormData();
      formData.append("file0", file0.value);
      await uploadUserImage(formData);

      console.log("Image uploaded successfully", "info");
    } catch (err) {
      console.log(err);
    }
  }
};

const submitForm = async () => {
  await uploadImage();

  const userToUpdate = {
    name: name.value,
    surname: surname.value,
    nick: nick.value,
    email: email.value,
    password: password.value,
  };

  try {
    const response = await updateUser(userToUpdate);
    router.push(`/profile/${userId}`);
  } catch (err) {
    console.log(err.message);
  }
};
</script>
