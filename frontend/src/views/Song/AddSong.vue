<template>
  <div class="container">
    <h1 class="my-4">Add Song</h1>
    <form @submit.prevent="submitForm">
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
      <div class="mb-3">
        <label for="file0" class="form-label">File: </label>
        <input
          name="file0"
          type="file"
          class="form-control"
          required
          @change="onFileChange"
        />
      </div>
      <button
        @click="addSong()"
        type="submit"
        class="m-3 btn btn-primary"
      >
        Save
      </button>
    </form>
    <Alert
      :type="alert.type"
      :message="alert.message"
      :show="alert.show"
      @close="alert.show = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref , onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Alert from "../../components/Alert.vue";
import { saveSong, uploadSongFile } from "../../composables/apiServices";

const route = useRoute();
const router = useRouter();
const name = ref("");
const track = ref("");
const duration = ref("");
const file = ref(null);
const albumId = route.params.albumId;
const fields = [
      { id: 'name', label: 'Name:', model: name, type: 'text', required: true },
      { id: 'track', label: 'Track:', model: track, type: 'text', required: true },
      { id: 'duration', label: 'Duration:', model: duration, type: 'text', required: true },
    ];

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

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

// Fetch song data from API when component is mounted
const addSong = async () => {
  try {
    const song = {
    name: name.value,
    duration: duration.value,
    track: track.value,
    album: albumId,
  };
    const res = await saveSong(song);
    const savedSong = res.savedSong;
    const id = savedSong._id;

    if (!file.value) {
      showAlert(res.message, "info");
      return;
    }
    const audioFormData = new FormData();
    audioFormData.append("file0", file.value);
    await uploadSongFile(audioFormData, id);
    console.log(res.message);
    router.push(`/album/${albumId}`);
  } catch (error) {
    console.error(error);
    showAlert("Failed to save artist!");
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
