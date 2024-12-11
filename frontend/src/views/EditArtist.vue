<template>
  <div class="view">
    <form class="mt-5" @submit.prevent="submitForm">
      <h1 class="mt-5 text-center">Edit Artist</h1>

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
          @click="update(name, description)"
          type="submit"
          class="m-3 button "
        >
          Save
        </button>
        <button class=" button m-3 ">
          <RouterLink class="nav-link" :to="`/artist/${route.params.id}`"
            >Back</RouterLink
          >
        </button>
      </div>
    </form>

    <Alert
      :type="alert.type"
      :message="alert.message"
      :show="alert.show"
      @close="alert.show = false"
    />
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}
form{
  margin-bottom: 3em;
}

.view{
  min-height: 100vh;
  background-color: var(--darker-background-color);
  margin-top: 2em;
}

.form-control {
  background-color: var(--darker-background-color);
  color: var(--primary-color);
}

.form-control::placeholder {
  color: var(--muted-text-color);
}

.form-control:focus {
  border: solid 1px var(--primary-color);
}

form{
  background-color: var(--background-color);
  padding: 40px;

}

h1{
  color: var(--primary-color);
}

.custom-file-input {
  color: var(--primary-color);
}

.button{
  background-color: var(--primary-color);
  border: none;
  padding: 0.5em 1em;
}
</style>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import Alert from "../components/Alert.vue";
import { uploadArtistImage, updateArtist, getArtist } from "../composables/apiServices";

const artist = ref("");
const file0 = ref();
const router = useRouter();
const route = useRoute();
const name = ref("");
const description = ref("");
const artistId = route.params.id;
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const fields = [
  { id: "name", label: "Name:", model: name, type: "text", required: true },
  {
    id: "description",
    label: "Description:",
    model: description,
    type: "textarea",
    required: true,
  },
];

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const handleFileUpload = (event) => {
  file0.value = event.target.files[0];
};

const upload = async () => {
  if (file0.value) {
    try {
      let formData = new FormData();
      formData.append("file0", file0.value);
      await uploadArtistImage(formData, artistId);

      showAlert("Image uploaded succesfully", "info");
    } catch (err) {
      showAlert(err.response.data.message, "danger");
    }
  }
};

const update = async (name, description) => {
  await upload();

  try {
    const res = await updateArtist(artistId, name, description);
    showAlert(res.message, "info");
    router.push(`/artist/${route.params.id}`);
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

const fetchArtist = async () => {
  try {
    const res = await getArtist(artistId);
    artist.value = res.artist;
    name.value = artist.value.name;
    description.value = artist.value.description;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchArtist();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>
