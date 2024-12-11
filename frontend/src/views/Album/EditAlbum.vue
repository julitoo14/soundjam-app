<template>
  <div class="container">
    <h1 class="mt-5 text-center">Edit Album</h1>
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
      <div class="form-group">
        <label for="file0" class="form-label">Image: </label>
        <input
          name="file0"
          type="file"
          class="form-control"
          @change="handleFileUpload"
        />
        <button
          @click="update(title, description, year)"
          type="submit"
          class="m-3 btn btn-primary"
        >
          Edit
        </button>
        <button class="m-3 btn btn-primary">
          <RouterLink class="nav-link" :to="`/album/${route.params.id}`"
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

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import Alert from "../../components/Alert.vue";
import { uploadAlbumImage, updateAlbum, getAlbum } from "../../composables/apiServices";

const router = useRouter();
const route = useRoute();
const album = ref('');
const title = ref("");
const year = ref("");
const description = ref("");
const albumId = route.params.id;
const file0 = ref();
const fields = [
      { id: 'name', label: 'Title:', model: title, type: 'text', required: true, },
      { id: 'description', label: 'Description:', model: description, type: 'text', required: false },
      { id: 'year', label: 'Year:', model: year, type: 'text', required: false },
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

const handleFileUpload = (event) => {
  file0.value = event.target.files[0];
};

const upload = async () => {
  if (file0.value) {
    try{
      let formData = new FormData();
      formData.append("file0", file0.value);
      await uploadAlbumImage(formData, albumId);
    }catch(err){
      showAlert(err.message, "danger");
    }
  }
};

const update = async (title, description, year) => {
  upload();
  try {
    const updatedAlbum = {
      title: title,
      description: description,
      year: year,
    };
    const res = await updateAlbum(updatedAlbum, albumId);
    console.log(res);
    router.push(`/album/${albumId}`);
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

const fetchAlbum = async () => {
  try {
    const res = await getAlbum(albumId);
    album.value = res.album;
    title.value = album.value.title;
    year.value = album.value.year;
    description.value = album.value.description;
  } catch (error) {
    console.log(error.message);
  }
};

onMounted(() => {
  fetchAlbum();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role != "role_admin") {
    router.push("/");
  }
});
</script>

<style>
@media (max-width: 768px) {

}
</style>
