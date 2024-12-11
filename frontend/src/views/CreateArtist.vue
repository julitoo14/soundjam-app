<template>
  <div class="view">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <form>
          <h1 class="text-center mb-4">Create Artist</h1>

          <div class="form-group" v-for="field in fields" :key="field.id">
            <input
              :type="field.type"
              class="form-control"
              :id="field.id"
              v-model="field.model.value"
              :placeholder="field.label"
              :required="field.required"
            />
          </div>
          <div class="form-group">
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                @change="onFileChange"
                id="image"
              />
            </div>
          </div>
          <button
            type="button"
            class="add-button mt-4"
            @click="addArtist"
          >
            Save Artist
          </button>
        </form>
        <Alert
          :type="alert.type"
          :message="alert.message"
          :show="alert.show"
          @close="alert.show = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, reactive, onMounted } from "vue";
import Alert from "../components/Alert.vue";
import { useRouter } from "vue-router";
import { saveArtist, uploadArtistImage } from "../composables/apiServices.js";

const name = ref("");
const description = ref("");
const image = ref("default.png");
const router = useRouter();
const fields = [
  { id: "name", label: "Name", model: name, type: "text", required: true },
  { id: "description", label: "Description", model: description, type: "textarea", required: true },
]
let alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const onFileChange = (event) => {
  image.value = event.target.files[0];
};

const addArtist = async () => {
  const artist = {
    name: name.value,
    description: description.value,
  };

  try {
    const res = await saveArtist(artist);
    const savedArtist = res.artist;
    const artistId = savedArtist._id;

    if (image.value == "default.png") {
      showAlert("Artist saved successfully!",'info');
      return;
    }
    const imageFormData = new FormData();
    imageFormData.append("file0", image.value);
    await uploadArtistImage(imageFormData, artistId);
    showAlert("Artist saved successfully!", 'info');
    router.push(`/artist/${artistId}`);
  } catch (error) {
    console.error(error);
    showAlert(error.message, 'danger');
  }
};

onMounted( () => {
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}
form{
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

.add-button{
  background-color: var(--primary-color);
  border: none;
  padding: 0.5em 1em;
}

</style>
