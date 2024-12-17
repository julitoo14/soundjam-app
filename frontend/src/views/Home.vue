<template>
  <div class="bg-gray-950 p-3">

    <div class="text-center relative">
      <h3 class="text-white text-lg">
        Welcome {{ nick }} to <span class=" text-purple-600">SoundJam!</span>
      </h3>
      <button v-if="!showSearchBar" @click="showSearchBar = !showSearchBar"
        class="absolute right-0 md:right-8 top-0 h-8 w-8 md:h-10 md:w-10">
        <Search />
      </button>
      <div class="relative" v-if="showSearchBar">
        <input ref="searchInput"
          class="z-0 w-full bg-gray-700 text-white placeholder-gray-400 p-4 pr-12 rounded focus:outline-none focus:ring focus:ring-purple-600"
          v-model="searchTerm" @input="search" type="text"
          placeholder="Search for your songs, artists, albums, playlists" />
        <button @click="showSearchBar = !showSearchBar; searchTerm = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full h-8 w-8 flex items-center justify-center">
          X
        </button>
      </div>

    </div>

    <div v-if="searchTerm && !loading" class="w-full px-4 py-2">
      <ul ref="list" class="space-y-4">
        <li class="result-item flex items-center bg-gray-800 p-4 rounded-lg" v-for="song in searchSongsResults" :key="song._id">
          <RouterLink class="flex justify-between items-center w-full text-white" :to="`/album/${song.album}`">
            <p class="text-sm">Song</p>
            <p class="text-sm font-semibold">{{ song.name }}</p>
            <p v-if="!isMobile" class="text-xs text-gray-400">{{ song.duration }}</p>
          </RouterLink>
        </li>

        <li class="result-item flex items-center bg-gray-800 p-4 rounded-lg" v-for="artist in searchArtistResults"
          :key="artist._id">
          <RouterLink class="flex justify-between items-center w-full text-white" :to="`/artist/${artist._id}`">
            <p class="text-sm">Artist</p>
            <p class="text-sm font-semibold">{{ artist.name }}</p>
            <img v-if="!isMobile" :src="`${API_BASE_URL}/artist/image/${artist.image}`"
              class="w-12 h-12 object-cover rounded-full" />
          </RouterLink>
        </li>

        <li class="result-item flex items-center bg-gray-800 p-4 rounded-lg" v-for="album in searchAlbumsResults" :key="album._id">
          <RouterLink class="flex justify-between items-center w-full text-white" :to="`/album/${album._id}`">
            <p class="text-sm">Album</p>
            <p class="text-sm font-semibold">{{ album.title }}</p>
            <img v-if="!isMobile" :src="`${API_BASE_URL}/album/image/${album.image}`"
              class="w-12 h-12 object-cover rounded-lg" alt="" />
          </RouterLink>
        </li>

        <li
          v-if="searchSongsResults.length === 0 && searchAlbumsResults.length === 0 && searchArtistResults.length === 0 && !loading"
          class="text-white text-center">No results found</li>
      </ul>
    </div>
    <div v-else-if="loading" class="flex justify-center items-center h-96">
      <div class="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>


    <div v-else-if="!loading" class="px-4">
      <h2 class="text-white text-4xl font-bold py-2">Albums</h2>
      <div>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Album class="bg-gray-900 p-2 rounded-lg animate-fadeIn hover:scale-105 transition" v-for="album in showedAlbums"
            :key="album._id" :album="album" :albumImage="`${API_BASE_URL}/album/image/${album.image}`" />
        </div>
        <h2 class="text-white text-4xl font-bold py-2">Artists</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Artist class="bg-gray-900 p-2 rounded-lg animate-fadeIn hover:scale-105  transition" v-for="artist in showedArtists"
            :key="artist._id" :artist="artist" :artistImage="`${API_BASE_URL}/artist/image/${artist.image}`" />
        </div>
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

const delay = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};


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
  loading.value = true;
  window.addEventListener("resize", updateIsMobile);
  window.addEventListener("keydown", handleKeyDown);
  fetchPlaylists();
  fetchArtists();
  fetchAlbums();
  loading.value = false;
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

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const fetchArtists = async () => {
  try {
    const res = await getArtists();
    state.artists = res.artists;
    const shuffledArtists = shuffleArray([...res.artists]); // Mezclar los artistas
    showedArtists.value = shuffledArtists.slice(0, 5); // Tomar los primeros 5
  } catch (err) {
    console.log(err.message);
  }
};

const fetchAlbums = async () => {
  try {
    const res = await getRandomAlbums();
    albums.value = res.albums;
    const shuffledAlbums = shuffleArray([...res.albums]); // Mezclar los álbumes
    showedAlbums.value = shuffledAlbums.slice(0, 5); // Tomar los primeros 5
  } catch (err) {
    console.log(err.message);
  }
};



const search = delay(async () => {
  loading.value = true;
  if (searchTerm.value.length > 0) {
    const resSongs = await getSongsBySearch(searchTerm.value);
    const resAlbums = await getAlbumsBySearch(searchTerm.value);
    const resArtists = await getArtistsBySearch(searchTerm.value);
    searchSongsResults.value = resSongs.songs;
    searchAlbumsResults.value = resAlbums.albums;
    searchArtistResults.value = resArtists.artists;
    console.log(searchArtistResults.value);
  } else {
    fetchArtists();
    fetchPlaylists();
    fetchAlbums();
  }
  loading.value = false;
}, 500); // El delay aquí es de 500ms

</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
}

.loader div {
  width: 15px;
  height: 15px;
  margin: 3px;
  background-color: #3498db;
  border-radius: 50%;
  animation: bounce 1.5s infinite ease-in-out;
}

.loader div:nth-child(2) {
  animation-delay: 0.2s;
}

.loader div:nth-child(3) {
  animation-delay: 0.4s;
}

.result-item {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@keyframes bounce {

  0%,
  80%,
  100% {
    transform: scale(0);
  }

  40% {
    transform: scale(1);
  }
}
</style>