<template>
  <div class="container-fluid">

    <h2></h2>

    <table v-if="showTable" class="table table-hover">
      <thead>
        <tr>
          <th style="text-align: left" scope="col">Name</th>
          <th style="text-align: left" scope="col">Duration</th>
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
        :track="false"
        :playlistview="true"
      />
    </table>
  </div>
</template>

<style scoped>
  .table{
    width: 100%;
    background-color: black;
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

const getSongsFiles = async  () => {
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
    const res = await removeSongFromPlaylist(id)
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
