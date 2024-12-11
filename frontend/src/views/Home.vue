<template>
  <div class="homePage">
    <div class="hero">
      <h3>Welcome {{ nick }} to <span class="text-pri">SoundJam!</span></h3>
    </div>
    <div style="width: 100%;">
      <input
      class="searchbar-full"
      v-model="searchTerm"
      @input="search"
      type="text"
      placeholder="Search for your songs, artists, albums, playlists"
      />
    </div>

    <div v-if="searchTerm" class="searchResults">
      <ul ref="list" class="list">
        <li class="item" v-for="song in searchSongsResults" :key="song._id">
          <RouterLink class="link" :to="`/album/${song.album}`">
            <p class="result-text">Song</p>
            <p class="result-text">{{ song.name }}</p>
            <p v-if="!isMobile" class="third-text">{{ song.duration }}</p>
          </RouterLink>
        </li>

        <li class="item" v-for="artist in state.artists" :key="artist._id">
          <RouterLink class="link" :to="`/artist/${artist._id}`">
            <p class="result-text">Artist</p>
            <p class=" result-text">{{ artist.name }}</p>
            <img
              v-if="!isMobile"
              :src="`${API_BASE_URL}/artist/image/${artist.image}`"
              class=" mini-img "
            />
          </RouterLink>
        </li>

        <li class="item" v-for="playlist in playlists" :key="playlist._id">
          <RouterLink class="link" :to="`/playlist/${playlist._id}`">
            <p class="result-text">Playlist</p>
            <p class=" result-text">{{ playlist.name }}</p>
            <p v-if="!isMobile" class="third-text ">{{ playlist.songs.length }} Songs</p>
          </RouterLink>
        </li>

        <li class="item" v-for="album in albums" :key="album._id">
          <RouterLink class="link" :to="`/album/${album._id}`">
            <p class="result-text">Album</p>
            <p class="result-text">{{ album.title }}</p>
            <img
              v-if="!isMobile"
              class="mini-img"
              :src="`${API_BASE_URL}/album/image/${album.image}`"
              alt=""
            />
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="container-fluid homeScreen" v-else>
      <h2 class="text-pri">Albums</h2>
      <div class="albums">
        <Album
        class="album"
        v-for="album in albums"
        :key="album._id"
        :album="album"
        :albumImage="`${API_BASE_URL}/album/image/${album.image}`"
        />
      </div>
      <h2 class="text-pri">Artists</h2>
      <div class="albums">
        <Artist
        v-for="artist in state.artists"
        :key="artist._id"
        :artist="artist"
        :artistImage="`${API_BASE_URL}/artist/image/${artist.image}`"
        class="album"
        />
      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import {getPlaylists, getArtists, getRandomAlbums, getSongsBySearch, getAlbumsBySearch} from "../composables/apiServices";
import { API_BASE_URL } from "../../config";
import Album from "../components/Album.vue";
import Artist from "../components/Artist.vue";

const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
const nick = decoded.nick;
const userId = decoded.id;
console.log(userId);
const showTable = ref(false);
const playlists = ref([]);
const albums = ref([]);
const state = reactive({
  artists: [],
  page: 1,
  imageUrl: "",
});
const searchTerm = ref("");
const searchArtistsResults = ref([]);
const searchPlaylistsResults = ref([]);
const searchSongsResults = ref([]);

const isMobile = ref(window.innerWidth <= 768);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
});

const fetchPlaylists = async () => {
  try {
    const res = await getPlaylists();
    playlists.value = res.playlists;
    if (playlists.value.length > 0) {
      showTable.value = true;
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchArtists = async () => {
  try {
    const res = await getArtists();
    state.artists = res.artists;
  } catch (err) {
    console.log(err.message);
  }
};

const fetchAlbums = async () => {
  try {
    const res = await getRandomAlbums();
    albums.value = res.albums;
  } catch (err) {
    console.log(err.message);
  }
};

const searchArtists = async () => {
  searchArtistsResults.value = state.artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  state.artists = searchArtistsResults.value;
};

const searchPlaylists = async () => {
  searchPlaylistsResults.value = playlists.value.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  playlists.value = searchPlaylistsResults.value;
};

const searchSongs = async () => {
  const res = await getSongsBySearch(searchTerm.value);
  searchSongsResults.value = res.songs;
};

const searchAlbums = async () => {
  const res = await getAlbumsBySearch(searchTerm.value);
  albums.value = res.albums;
};

const search = async () => {
  if (searchTerm.value.length > 0) {
    searchArtists();
    searchPlaylists();
    searchSongs();
    searchAlbums();
  } else {
    fetchArtists();
    fetchPlaylists();
    fetchAlbums();
  }
};

onMounted(() => {
  fetchPlaylists();
  fetchArtists();
  fetchAlbums();
});
</script>

<style scoped>

.item {
  background-color: rgba(44, 42, 44, 0.56);
  width: 100%;
  height: 85px;
  display: flex;
  border: rgba(53, 53, 53, 0.37) solid 1px;
}

.text-pri{
  color: var(--primary-color);
}

.item:hover {
  background-color: rgba(24, 23, 23, 0.637);
}
.link {
  width: 100%;
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: auto;
}

.link p{
  margin: 0;
}

.mini-img {
  max-width: 80px;
  object-fit: cover;
}

.homeScreen{
  background-color: var(--background-color);
  margin-bottom: 2em;
  padding: 1em;
}

.list {
  list-style: none;
  padding: 0;
}

.homePage {
  background: var(--darker-background-color);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 100px;
}
.searchbar-full {
  width: 100%;
  background-color: var(--background-color);
  height: 60px;
  text-align: center;
  color: rgb(255, 255, 255);
  margin-bottom: 1em;
  font-size: large;
  border: none;
}

.searchbar-full:focus {
  outline: none;
  color: var(--primary-color);
  border: solid 1px var(--primary-color);
}

.searchbar-full::placeholder {
  color: var(--muted-text-color);
}

.searchResults {
  width: 70%;
  overflow-y: auto;
}

.hero{
  background-color: var(--darker-background-color);
  width: 100%;
  text-align: center;
}

.albums{
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    width: 100%;
    margin: auto;
    gap: 0.8em;
  }


  h1{
    color: white;
    font-size: 2em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

.album{
  background-color: rgba(0, 0, 0, 0.795);
}

.result-text{
  white-space: nowrap;      /* Evita que el texto se rompa en varias líneas */
  overflow: hidden;         /* Oculta el texto que sobrepasa el límite de ancho */
  text-overflow: ellipsis; /* Muestra los tres puntos (...) al final del texto */
  max-width: 200px;
  padding: 0;
  margin: 0;
}

.third-text{
  width: 80px;
  text-align: center;
}


@media (max-width: 768px) {

  .link{
    font-size: 0.8em;
  }

  .result-text{
    white-space: nowrap;      /* Evita que el texto se rompa en varias líneas */
    overflow: hidden;         /* Oculta el texto que sobrepasa el límite de ancho */
    text-overflow: ellipsis; /* Muestra los tres puntos (...) al final del texto */
    width: 150px;
  }

  .homePage {
    min-height: 100vh;
  }


  .hero{
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    text-align: center;
  }

  .hero h1{
    font-size: 1.5em;
  }

  .hero h5{
    font-size: 1em;
  }

  .searchbar-full {
    width: 100%;
    border: none;
    height: 2.5em;
  }

  .searchResults {
    width: 90%;
    overflow-y: auto;
  }

  .albums{
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    width: 95%;
    gap: 0.2em;
  }



  .item h3{
    font-size: 1em;
    width: 30%;
    margin: auto;
  }

  .item h1{
    font-size: 1.1em;
    width: 30%;
    margin: auto;
  }

  .item-link img{
    width: 70px;
    height: 70px;
  }

  h2{
    padding: 20px;
    text-align: center;
  }


}
</style>
