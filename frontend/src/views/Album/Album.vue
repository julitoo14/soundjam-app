<template>
  <div class=" bg-gray-950 animate-fadeIn">
    <div class="container mx-auto">
      <div class="info p-6 flex flex-col md:flex-row gap-8 text-white">
        <div>
          <LazyImage :src="albumImage" alt="Album Cover" class="w-72 h-72 object-cover m-auto md:!m-0" />
        </div>
        <div class="album-info space-y-4">
          <h1 class="text-4xl font-bold">{{ album.title }}</h1>
          <h2 class="text-2xl font-medium">{{ artist.name }}</h2>
          <p class="text-sm">{{ album.description }}</p>
          <p class="text-sm">Year: {{ album.year }}</p>
          <div v-if="admin" class="buttons flex space-x-4">
            <RouterLink class="text-purple-500 hover:text-purple-700" :to="`/addSong/${albumId}`">
              <AddIcon class="w-8 h-8" />
            </RouterLink>

            <RouterLink class="text-purple-500 hover:text-purple-700" :to="`/editAlbum/${albumId}`">
              <Pencil class="w-8 h-8" />
            </RouterLink>

            <Delete class="w-8 h-8 cursor-pointer text-purple-500 hover:text-purple-700" @click="removeAlbum" />
          </div>
        </div>
      </div>
    </div>

    <table v-if="showTable" class="w-full md:w-full mt-6 md:m-auto text-white">
      <thead class="bg-gray-800">
        <tr class="">
          <th scope="col" class="py-2 px-2 text-center">#</th>
          <th class="py-2 px-2">Name</th>
          <th v-if="!isMobile" class="py-2 px-2">Duration</th>
          <th class="py-2 px-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody >
        <Song
          @playSong="$emit('playSong', song._id, albumId)"
          @removeSong="removeSong(song._id)"
          @addSong="showAdd()"
          v-for="song in songs"
          :key="song._id"
          :song="song"
          :track="true"
          :isMobile="isMobile"
          class=" bg-gray-700 hover:bg-gray-600"
        />
      </tbody>
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
} from "../../composables/apiServices";
import LazyImage from "../../components/LazyImage.vue";

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
    const res = await getSongsByAlbum(albumId);
    songs.value = res.songs;
    if (songs.value.length > 0) {
      showTable.value = true;
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
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

.song-row {
  background-color: rgba(0, 0, 0, 0.795);
}
</style>
