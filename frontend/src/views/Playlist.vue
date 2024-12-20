<template>
  <div class="w-full md:w-4/5 mx-auto px-4 ">
    <!-- Tabla -->
    <table v-if="showTable" class="w-full table-auto text-left bg-black text-white rounded-lg overflow-hidden">
      <thead class="bg-gray-800">
        <tr>
          <th class="py-2 px-2">Name</th>
          <th class="py-2 px-2">Duration</th>
          <th class="py-2 px-2">Actions</th>
        </tr>
      </thead>

      <!-- Componente Song -->
      <tbody>
        <Song
          @playSong="$emit('playSong', song._id, song.album._id, playlistId)"
          @removeSong="removeSong(song._id)"
          @addSong="showAdd()"
          v-for="song in songs"
          :key="song._id"
          :song="song"
          :track="false"
          :playlistview="true"
          class="hover:bg-gray-700"
        />
      </tbody>
    </table>

    <!-- Mensaje si no hay canciones -->
    <div v-else class="text-center text-gray-400 mt-4">
      No songs available in this playlist.
    </div>
  </div>
</template>

<style scoped>
/* Personalización opcional */
.table-auto th,
.table-auto td {
  text-align: left;
}

.table-auto th {
  font-weight: bold;
}
</style>

<script setup>
import Song from "../components/Song.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getSongsByPlaylist, getSong, removeSongFromPlaylist } from "../composables/apiServices";
import { API_BASE_URL } from "../../config";
const songs = ref([]);
const playlistSongs = ref([]);
const route = useRoute();
const showTable = ref(true);
const playlistId = route.params.id;

const fetchSongs = async () => {
  songs.value = [];
  try {
    const res = await getSongsByPlaylist(playlistId);
    playlistSongs.value = res.songs;
    await getSongsFiles();
    songs.value.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.log(error);
  }
  if (songs.value.length > 0) {
    showTable.value = true;
  }
};

const getSongsFiles = async () => {
  const promises = playlistSongs.value.map(async (song) => {
    const res = await getSong(song);
    song = res.song;
    song.file = `${API_BASE_URL}/song/file/${song.file}?token=${localStorage.getItem(
      "token"
    )}`;
    return song;
  });
  songs.value = await Promise.all(promises);
};

const removeSong = async (id) => {
  try {
    const res = await removeSongFromPlaylist(id);
    console.log(res.message);
    fetchSongs();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchSongs();
});
</script>
