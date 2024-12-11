<template>
  <div class="container">
    <h1>Edit Song</h1>
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
      <div class="form-group">
        <label for="file0">File:</label>
        <input
          type="file"
          class="form-control"
          name="file0"
          @change="onFileChange"
        />
      </div>
      <button @click="update" type="submit" class="btn btn-primary">
        Save
      </button>
      <button class="btn btn-danger">
        <RouterLink class="nav-link" to="/">Back</RouterLink>
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
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import Alert from "../../components/Alert.vue";
import {
  getSong,
  uploadSongFile,
  updateSong,
} from "../../composables/apiServices";

const track = ref();
const name = ref();
const duration = ref();
const route = useRoute();
const router = useRouter();
const file = ref();
const albumId = ref();
const songId = route.params.id;
const fields = [
  { id: "name", label: "Name:", model: name, type: "text", required: true },
  { id: "track", label: "Track:", model: track, type: "text", required: true },
  {
    id: "duration",
    label: "Duration:",
    model: duration,
    type: "text",
    required: true,
  },
];
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});
const config = {
  headers: {
    Authorization: `${localStorage.getItem("token")}`,
  },
};

const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const fetchSong = async () => {
  const res = await getSong(songId);
  track.value = res.song.track;
  name.value = res.song.name;
  duration.value = res.song.duration;
  albumId.value = res.song.album._id;
};

const update = async () => {
  const song = {
    track: track.value,
    name: name.value,
    duration: duration.value,
    album: albumId.value,
  };
  try{
    if (file.value) {
      const audioFormData = new FormData();
      audioFormData.append("file0", file.value);
      await uploadSongFile(audioFormData, songId, config);
    }

    const res = await updateSong(song, songId, config);
    showAlert("Song updated successfully!", "info");
    console.log(res);
    router.push(`/album/${albumId.value}`);

  }catch(err){
    showAlert(err.response.data.message, "danger");
  }
};

onMounted(() => {
  fetchSong();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>
