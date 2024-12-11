<template>
  <div class="view">
    <div class="top p-4">
      <img class="avatar" :src="avatarUrl" alt="" />
      <div class="info">
        <p>Perfil</p>
        <h1 class="primary">{{ user.name }}</h1>
        <h3>{{ user.nick }} ~ {{ user.email }}</h3>
      </div>
      <div class="top-buttons">
        <button class="top-button"><RouterLink class="nav-link" :to="`/editUser/${id}`">Edit User</RouterLink></button>
        <button class="top-button" @click="signOut">Sign Out</button>
      </div>
    </div>

    <div class="container-fluid ">
      <h1 class="primary">Playlists</h1>
      <button class="top-button" @click="showAddPlaylist">
        New Playlist
      </button>
      <table v-if=(showTable) class="table table-hover">
        <thead >
          <tr>
            <th scope="col">Playlist Name</th>
            <th scope="col">Number of Songs</th>
            <th scope="col">options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="playlist in playlists" :key="playlist._id">
            <td>{{ playlist.name }}</td>
            <td>{{ playlist.songs.length }}</td>
            <td><div class="btn-group">
              <button class="button"><RouterLink class="nav-link" :to="`/playlist/${playlist._id}`">Visit</RouterLink></button>
              <button @click="showDeleteModal = true, playlistToDelete = playlist._id" class="button">Remove</button>
            </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AddPlaylist
      v-if="showPlaylistModal"
      @close="showPlaylistModal = false"
      :show="showPlaylistModal"
      @update="fetchPlaylists()"
      class="add-playlist-modal"
    />
    <DeleteModal
    v-if="showDeleteModal"
    @close="showDeleteModal = false"
    :show="showDeleteModal"
    @delete="removePlaylist(playlistToDelete), showDeleteModal = false"
    ></DeleteModal>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter} from "vue-router";
import AddPlaylist from "../components/AddPlaylist.vue";
import { deletePlaylist, getPlaylistsByUser, getUserProfile } from "../composables/apiServices";
import DeleteModal from "../components/DeleteModal.vue";
import { API_BASE_URL } from "../../config";
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const user = ref({});
const avatarUrl = ref("");
const showPlaylistModal =ref('');
const showDeleteModal = ref(false);
const playlistToDelete = ref("");
const showTable = ref(false);
const playlists = ref([]);
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nick");
  localStorage.removeItem("id");
  router.go("/login");
  
};


const fetchUser = async () => {
  try{
    const res = await getUserProfile(id);
    user.value = res.user;
    avatarUrl.value = `${API_BASE_URL}/user/avatar/${user.value.image}`;
  }catch(err){
    console.log(err.message);
  }
}


const showAddPlaylist = () => {
  showPlaylistModal.value = true;
};


const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const fetchPlaylists = async () => {
  try {
    const res = await getPlaylistsByUser(id);
    playlists.value = res.playlists;
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

const removePlaylist = async (id) => {
  try{
    await deletePlaylist(id);
    await fetchPlaylists();
  }catch(err){
    console.log(err, "danger");
  }
}

onMounted(async () => {
  await fetchPlaylists();
  await fetchUser();
  if(playlists.value.length > 0){
  showTable.value = true;
  }
});
</script>

<style scoped>

.view{
  background-color: var(--darker-background-color);
  min-height: 100vh;
}

div{
  cursor: default;
}

.table td{
  background-color: black;
  color: white;
  border: #706868 solid 1px;
  
}

.table{
  border: none;
  color: white;
  margin: auto;
}

.table th{
  background-color: rgb(25, 24, 24);
  color: white;
  border: black solid 1px;
}

.button{
  background-color: var(--primary-color);
  border: none;
  color: white;
  margin-right: 10px;
}

.avatar {
  width: 12em;
  height: 12em;
  border-radius: 50%;
}

.primary{
  color: var(--primary-color);
}

.top-button{
  height: 4em;
  text-align: center;
  margin: 5px;
  background-color: var(--primary-color);
  color: white;
}

.top-buttons{
  display: flex;
  flex-direction: row;
  align-items: center;
}

form {
  width: 60%;
  margin: auto;
}

button {
  height: 2em;
  text-align: center;
}

.top {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}

.top h1 {
  font-size: 6em;
}

.info {
  width: 75%;
}

@media (max-width: 768px) {
  .avatar{
    width: 8em;
    height: 8em;
  }

  .info{
    text-align: center;
  }

  .top h1 {
    font-size: 3em;
  }

  .top h3{
    font-size: 0.8em;
  }

  .top{
    flex-direction: column;
    align-items: center;
  }

  .info p{
    display: none;
  }

  .top-button{
    width: 8em;
    height: 3em;
    font-size: 0.8em;
  }




}


  
</style>
