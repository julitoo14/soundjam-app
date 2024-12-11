<template>
  <div class="albumView">
    <div class="container-fluid">
      <div class="info p-3">
        <img :src="albumImage" alt="Album Cover" class="album-cover" />
        <div class="album-info">
          <h1>{{ album.title }}</h1>
          <h2>{{ artist.name }}</h2>
          <p>{{ album.description }}</p>
          <p>Year: {{ album.year }}</p>
          <div v-if="admin" class="buttons">
            <RouterLink class="nav-link" :to="`/addSong/${albumId}`"
              ><AddIcon />
            </RouterLink>

            <RouterLink class="nav-link" :to="`/editAlbum/${albumId}`"
              ><Pencil
            /></RouterLink>

            <Delete class="button" @click="removeAlbum"></Delete>
          </div>
        </div>
      </div>
    </div>

    <table v-if="showTable" class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th class="text-left" scope="col">Name</th>
          <th v-if="!isMobile" class="text-left" scope="col">Duration</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <Song
        @playSong="$emit('playSong', song._id, songs)"
        @removeSong="removeSong(song._id)"
        @addSong="showAdd()"
        v-for="song in songs"
        :key="song._id"
        :song="song"
        :track="true"
        :isMobile="isMobile"
        class="song-row"
      />
    </table>

    <AddSongToPlaylist
      v-if="showAddPlaylistModal"
      @close="showAddPlaylistModal = false"
      :show="showAddPlaylistModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { router } from "../../routes";
import Song from "../../components/Song.vue";
import AddSongToPlaylist from "../../components/AddSongToPlaylist.vue";
import Delete from "../../assets/icons/Delete.vue";
import Pencil from "../../assets/icons/Pencil.vue";
import AddIcon from "../../assets/icons/AddIcon.vue";
import { API_BASE_URL } from "../../../config";
import {
  getAlbum,
  getSongsByAlbum,
  deleteAlbum,
  deleteSong,
  getSong,
} from "../../composables/apiServices";

const route = useRoute();
const album = ref("");
const artist = ref("");
const albumImage = ref("");
const songs = ref([]);
const showTable = ref(false);
const admin = ref(false);
const showAddPlaylistModal = ref(false);
const albumId = route.params.id;
const isMobile = ref(window.innerWidth < 768);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const showAdd = () => {
  showAddPlaylistModal.value = true;
};

const fetchAlbum = async () => {
  try {
    const res = await getAlbum(albumId);
    album.value = res.album;
    artist.value = res.album.artist;
    albumImage.value = `${API_BASE_URL}/album/image/${album.value.image}`;
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const fetchSongs = async () => {
  try {
    //get album songs
    const res = await getSongsByAlbum(albumId);
    songs.value = res.songs;
    //get songs files
    getFilesFromSongs();
    if (songs.value.length > 0) {
      showTable.value = true;
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const getFilesFromSongs = async () => {
  const promises = songs.value.map(async (song) => {
    const res = await getSong(song._id);
    song = res.song;
    song.file = `${API_BASE_URL}/song/file/${
      song.file
    }?token=${localStorage.getItem("token")}`;
    return song;
  });
  songs.value = await Promise.all(promises);
};

const removeAlbum = async () => {
  try {
    await deleteAlbum(albumId);
    router.push(`/artist/${artist.value._id}`);
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const removeSong = async (id) => {
  try {
    await deleteSong(id);
    fetchSongs();
  } catch (err) {
    console.log(err.response.data.message);
  }
};

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);

  fetchAlbum();
  fetchSongs();

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
});
</script>

<style scoped>
.albumView{
  background-color: var(--darker-background-color);
  padding-bottom: 6em;
}

.text-left {
  text-align: left;
}

th {
  background-color: var(--background-color);
  color: white;
  text-align: center;
  font-size: 1.2em;
  border: none;
}
.info {
  color: white;
  background-color: rgba(0, 0, 0, 0.599);
  display: flex;
  flex-direction: row;
  gap: 2em;
}
.album-cover {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.albumView {
  height: 100vh;
  overflow-y: scroll;
}

.button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.buttons {
  gap: 1em;
  display: flex;
  flex-direction: row;
}

.buttons svg {
  width: 2em;
  height: 2em;
}

.table {
  overflow-y: scroll;
}

.song-row {
  background-color: rgba(0, 0, 0, 0.795);
}



@media (max-width: 768px) {
  .albumView {
     /* Ajusta este valor según el tamaño de tu navbar */
    margin-bottom: 1em;
  }

  .album-cover {
    width: 100%;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .table{
    width: 100%;
    margin-bottom: 7em;
  }
}
</style>
