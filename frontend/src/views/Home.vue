<template>
  <div class="bg-gray-950 p-6">

    <div class="text-center relative">
      <h3 class="text-white text-lg">
        Welcome {{ nick }} to <span class=" text-purple-600">SoundJam!</span>
      </h3>
      <button v-if="!showSearchBar" @click="showSearchBar = !showSearchBar"
        class="absolute right-0 md:right-8 top-0 h-8 w-8 md:h-10 md:w-10">
        <Search />
      </button>
      <div class="relative" v-if="showSearchBar">
        <input
          ref="searchInput"
          class="z-0 w-full bg-gray-700 text-white placeholder-gray-400 p-4 pr-12 rounded focus:outline-none focus:ring focus:ring-purple-600"
          v-model="searchTerm" @input="search" type="text"
          placeholder="Search for your songs, artists, albums, playlists" />
        <button @click="showSearchBar = !showSearchBar ; searchTerm = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center">
          X
        </button>
      </div>

    </div>

    <div v-if="searchTerm && !loading" class="w-full px-4 py-2">
      <ul ref="list" class="space-y-4">
        <li class="flex items-center bg-gray-800 p-4 rounded-lg" v-for="song in searchSongsResults" :key="song._id">
          <RouterLink class="flex justify-between items-center w-full text-white" :to="`/album/${song.album}`">
            <p class="text-sm">Song</p>
            <p class="text-sm font-semibold">{{ song.name }}</p>
            <p v-if="!isMobile" class="text-xs text-gray-400">{{ song.duration }}</p>
          </RouterLink>
        </li>

        <li class="flex items-center bg-gray-800 p-4 rounded-lg"  v-for="artist in searchArtistResults" :key="artist._id">
          <RouterLink class="flex justify-between items-center w-full text-white" :to="`/artist/${artist._id}`">
            <p class="text-sm">Artist</p>
            <p class="text-sm font-semibold">{{ artist.name }}</p>
            <img v-if="!isMobile" :src="`${API_BASE_URL}/artist/image/${artist.image}`"
              class="w-12 h-12 object-cover rounded-full" />
          </RouterLink>
        </li>

        <li class="flex items-center bg-gray-800 p-4 rounded-lg" v-for="album in searchAlbumsResults" :key="album._id">
          <RouterLink class="flex justify-between items-center w-full text-white" :to="`/album/${album._id}`">
            <p class="text-sm">Album</p>
            <p class="text-sm font-semibold">{{ album.title }}</p>
            <img v-if="!isMobile" :src="`${API_BASE_URL}/album/image/${album.image}`"
              class="w-12 h-12 object-cover rounded-lg" alt="" />
          </RouterLink>
        </li>

        <li v-if="searchSongsResults.length === 0 && searchAlbumsResults.length === 0 && searchArtistResults.length === 0"
          class="text-white text-center">No results found</li>
      </ul>
    </div>
    <div v-else-if="loading" class="flex justify-center items-center h-96">
      <div class="loader"></div>
    </div>
    

    <div v-else class="p-4">
      <h2 class="text-purple-600 text-4xl font-bold py-2">Albums</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Album class="bg-gray-800 p-2 rounded-lg hover:scale-105 transition" v-for="album in showedAlbums" :key="album._id" :album="album"
          :albumImage="`${API_BASE_URL}/album/image/${album.image}`" />
      </div>
      <h2 class="text-purple-600 text-4xl font-bold py-2">Artists</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Artist class="bg-gray-800 p-2 rounded-lg hover:scale-105 transition" v-for="artist in showedArtists" :key="artist._id" :artist="artist"
          :artistImage="`${API_BASE_URL}/artist/image/${artist.image}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onBeforeUnmount, nextTick } from "vue";
import {
  getPlaylists,
  getArtists,
  getRandomAlbums,
  getSongsBySearch,
  getAlbumsBySearch,
  getArtistsBySearch
} from "../composables/apiServices";
import { API_BASE_URL } from "../../config";
import Album from "../components/Album.vue";
import Artist from "../components/Artist.vue";
import Search from "../assets/icons/Search.vue"

const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
const nick = decoded.nick;
const loading = ref(false);

const playlists = ref([]);
const albums = ref([]);
const state = reactive({
  artists: [],
  page: 1,
  imageUrl: "",
});
const searchTerm = ref("");
const searchSongsResults = ref([]);
const searchAlbumsResults = ref([]);
const searchArtistResults = ref([]);
const isMobile = ref(window.innerWidth <= 768);
const showSearchBar = ref(false);
const searchInput = ref(null);
const showedAlbums = ref([]);
const showedArtists = ref([]);


const handleKeyDown = (event) => {
  if (event.key === "Escape" && showSearchBar.value) {
    // Cerrar la barra al presionar Escape
    showSearchBar.value = false;
    searchTerm.value = "";
  } else if (!showSearchBar.value && event.key.length === 1 && !event.metaKey) {
    // Abrir la barra al presionar cualquier tecla alfabética
    showSearchBar.value = true;
    
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};



const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
  window.addEventListener("keydown", handleKeyDown);
  fetchPlaylists();
  fetchArtists();
  fetchAlbums();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("resize", updateIsMobile);
});

const fetchPlaylists = async () => {
  try {
    const res = await getPlaylists();
    playlists.value = res.playlists;
  } catch (err) {
    console.log(err);
  }
};

const fetchArtists = async () => {
  try {
    const res = await getArtists();
    state.artists = res.artists;
    showedArtists.value = res.artists.filter((artist, index) => index < 5);
  } catch (err) {
    console.log(err.message);
  }
};

const fetchAlbums = async () => {
  try {
    const res = await getRandomAlbums();
    albums.value = res.albums;
    showedAlbums.value = res.albums.filter((album, index) => index < 5);
  } catch (err) {
    console.log(err.message);
  }
};

const search = async () => {
  loading.value = true;
  if (searchTerm.value.length > 0) {
    const resSongs = await getSongsBySearch(searchTerm.value);
    const resAlbums = await getAlbumsBySearch(searchTerm.value);
    const resArtists = await getArtistsBySearch(searchTerm.value);
    searchSongsResults.value = resSongs.songs;
    searchAlbumsResults.value = resAlbums.albums;
    searchArtistResults.value = resArtists.artists;
  } else {
    fetchArtists();
    fetchPlaylists();
    fetchAlbums();
  }
  loading.value=false;
};
</script>

<style scoped>
.text-primary {
  color: var(--primary-color);
}

.loader{
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}
</style>