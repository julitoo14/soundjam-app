<template>
  <div class=" page">
    
    <div class="artist-container" >
        <div class="artist-info">
          <img class="artist-image " :src="image">
          <div>
            <h1 class="name">{{ artist.name }}</h1>
            <p class="description">{{ artist.description }}</p>
          
          <div v-if="admin">
              <button class="btn-success btn">
                <RouterLink class="nav-link" :to="`/createAlbum/${artist._id}`"
                >Create Album</RouterLink
                >
              </button>
              <button class="btn-primary btn">
                <RouterLink class="nav-link" :to="`/editArtist/${artist._id}`"
                >Edit Artist</RouterLink
                >
              </button>
              <button class="btn-danger btn" @click="showDeleteModal = true">
                Remove Artist
              </button>
          </div>
        </div>
      </div>
      <div class="albums">
        <Album
        class="album"
        v-for="album in albums"
        :key="album._id"
        :album="album"
        :albumImage="`${API_BASE_URL}/album/image/${album.image}`"
        />
      </div>
    </div>
  </div>
  <DeleteModal
  v-if="showDeleteModal"
  @close="showDeleteModal = false"
  :show="showDeleteModal"
  @delete="removeArtist(artistId), showDeleteModal = false"
  ></DeleteModal>
  </template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Album from "../components/Album.vue";
import { deleteArtist, getArtist, getAlbumsByArtist } from "../composables/apiServices";
import DeleteModal from "../components/DeleteModal.vue";
import { API_BASE_URL } from "../../config";

const router = useRouter();
const route = useRoute();
const admin = ref(false);
const artistId = route.params.id;
const artist = ref({});
const image = ref("");
const albums = ref([]);
const showDeleteModal = ref(false);


const removeArtist = async () => {
  try {
    const res = await deleteArtist(artist.value._id)
    router.push("/artists");
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getArtistData = async () => {
  try {
    
    const res = await getArtist(artistId);
    artist.value = res.artist;
    image.value = `${API_BASE_URL}/artist/image/${artist.value.image}`;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getAlbums = async () => {
  try{
    const res = await getAlbumsByArtist(artistId);
    albums.value = res.albums;
  }catch(error){
    console.log(error.response.data.message);
  }
};

onMounted(() => {
  getArtistData();
  getAlbums();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
});


</script>


<style scoped>

.mobile-name{
  display: none;
}

.page{
  min-height: 100vh;
  background-color: var(--darker-background-color);
  padding-top: 7em;
  overflow-y: auto;
  padding-bottom: 7em;
}

.artist-container {
  background-color: var(--background-color);
  width: 60%;
  border-radius: 10px;
  text-align:justify;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  margin: auto;
  gap: 2em;
}

.artist-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
  margin: auto;
}

.artist-info{
  display: flex;
  gap: 20px;
}

.name-img{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;  
}

.albums{
  display: flex;
  flex-direction: row;
  padding: 1em;
  width: 100%;
}

.album{
  background-color: rgba(0, 0, 0, 0.729);
}

.album:hover{
  background-color: rgb(46, 45, 45);
}


h1 {
  font-size: 4rem;
  margin-bottom: 10px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.description {
  font-size: 1.3rem;
  margin-bottom: 20px;
}



@media (max-width: 768px) {


  .artist-info{
    flex-direction: column;
    align-items: center;
  }

  .description{
    font-size: 1rem;
    overflow: scroll;
    max-height: 8em;
  }

  .page{
    padding-top: 0;
    background-color: var(--background-color);
  }

  .artist-container {
    padding: 10px;
    margin-bottom: 5em;
    width: 100%;
  }

  .name-img {
    gap: 0.3em;
    margin: auto;
  }

  .artist-image {
    width: 200px;
    height: 200px;
  }


  .albums{
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    width: 20em;
  }
  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
