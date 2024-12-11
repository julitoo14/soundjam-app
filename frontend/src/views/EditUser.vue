<template>
    <div class="container">
      <h1 class="mt-5 text-center">Edit User</h1>
      <form class="mt-5" @submit.prevent="submitForm">
        <div class="form-group" v-for="field in fields" :key="field.id">
          <label :for="field.id">{{ field.label }}</label>
          <input
            :type="field.type"
            class="form-control"
            :id="field.id"
            v-model="field.model.value"
            :required="field.required"
          />
        </div>
        <div>
          <label for="file0" class="form-label">Image: </label>
          <input
            name="file0"
            type="file"
            class="form-control"
            @change="handleFileUpload"
          />
          <button
            type="submit"
            class="m-3 btn btn-primary"
          >
            Save
          </button>
          <button class="m-3 btn btn-primary">
            <RouterLink class="nav-link" :to="`/profile/${route.params.id}`"
              >Back</RouterLink
            >
          </button>
        </div>
      </form>
    </div>
  </template>

  <style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: .375rem .75rem;
  margin-bottom: .5rem;
  border: 1px solid #ced4da;
  border-radius: .25rem;
}

.btn {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: .375rem .75rem;
  line-height: 1.5;
  border-radius: .25rem;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
</style>

  <script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { uploadUserImage, updateUser,  getUserProfile } from "../composables/apiServices";

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

      console.log("Image uploaded succesfully", "info");
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

  try{
      const response = await updateUser(userToUpdate);
      router.push(`/profile/${userId}`);
  }catch(err){
      console.log(err.message);
  }
};
</script>