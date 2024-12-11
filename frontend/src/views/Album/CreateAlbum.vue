<template>
    <div class="view">
          <form>
            <h1 class="text-center">Create Album</h1>
            <div class="form-group" v-for="field in fields" :key="field.id">
              <input
                class="form-control"
                v-model="field.model.value"
                :id="field.id"
                :placeholder="field.placeholder"
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
              @click="addAlbum"
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
  import { ref, reactive, onMounted } from "vue";
  import Alert from "../../components/Alert.vue";
  import { useRouter, useRoute } from "vue-router";
  import { saveAlbum, uploadAlbumImage } from "../../composables/apiServices";
  
  const title = ref("");
  const year = ref("");
  const description = ref("");
  const image = ref("default.png");
  const router = useRouter();
  const route = useRoute();
  const fields = [
      { id: 'title', label: 'Title', model: title, placeholder: 'Title:' },
      { id: 'description', label: 'Description', model: description, placeholder: 'Description:' },
      { id: 'year', label: 'Year', model: year, placeholder: 'Year:' },
    ];
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
  
  const addAlbum = async () => {
    const album = {
        title: title.value,
        description: description.value,
        year: year.value,
        artist: route.params.artistId,
    };

    try {
      const res = await saveAlbum(album);
  
      const savedAlbum = res.album;
      const id = savedAlbum._id;
  
      if (image.value == "default.png") {
        router.push(`/album/${id}`);
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("file0", image.value);
      await uploadAlbumImage(imageFormData, id); 
      router.push(`/album/${id}`);

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
  
  <style scoped>
  h1{
    color: var(--primary-color);
  }

  form{
    background-color: var(--background-color);
    padding: 2em;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  }

  .form-control {
    background-color: var(--darker-background-color);
    color: var(--primary-color);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-control:focus {
    border: solid 1px var(--primary-color);
  }

  .custom-file-input {
    color: var(--primary-color);
  }

  .add-button{
    background-color: var(--primary-color);
    border: none;
    padding: 0.5em 1em;
  }


  .view{
    padding-top: 7em;
    width: 100%;
    background-color: var(--darker-background-color);
    min-height: 100vh;
  }

  @media (max-width: 768px) {
    .view{
      padding-top:2em;
    }
  }
  </style>
  