<template>
    <div id="app" class="flex flex-col h-[100dvh] bg-gray-950 text-white">
      <Navbar class="flex-none  h-16 " v-if="logged"></Navbar>
      <RouterView
        class="flex-grow overflow-auto"
        v-on="route.path.includes('/album/') || route.path.includes('/playlist/') ? { playSong } : {}"
      ></RouterView>
      <Mp3Player
        v-if="logged"
        class="flex-none h-16 "
        :song="songInfo"
        :files="file"
        @previous="playPreviousSong"
        @next="playNextSong"
        @ended="playNextSong"
      ></Mp3Player>
    </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { isPlaying } from "./composables/useAudioPlayer.js";
import Navbar from "./components/Navbar.vue";
import Mp3Player from "./components/Mp3Player.vue";
import { ref, onMounted} from "vue";
import { useRoute } from "vue-router";
const logged = ref(false);
const file = ref("");
const playlist = ref([]);
const currentIndex = ref(0);
const songInfo = ref(null);

const isMobile = ref(window.innerWidth <= 768);
const route = useRoute();

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
  if (localStorage.getItem("token")) {
    logged.value = true;
  } else {
    logged.value = false;
  }
});

const playSong = async (id, files) => {
  playlist.value = files;
  isPlaying.value = true;

  // Search for song in playlist based on id and get its index
  const songIndex = playlist.value.findIndex((song) => song._id === id);
  if (songIndex !== -1) {
    currentIndex.value = songIndex;
    const song = playlist.value[songIndex];
    file.value = song.file;
    songInfo.value = song;
  }
};

const isLastSong = () => {
  if (currentIndex.value === playlist.value.length - 1) {
    currentIndex.value = 0;
    const song = playlist.value[currentIndex.value];
    file.value = song.file;
    songInfo.value = song;
    return true;
  }
};

const isFirstSong = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = playlist.value.length - 1;
    const song = playlist.value[currentIndex.value];
    file.value = song.file;
    songInfo.value = song;
    return true;
  }
};

const playNextSong = () => {
  isPlaying.value = true;
  if (isLastSong()) {return;}
  currentIndex.value = currentIndex.value + 1;
  const song = playlist.value[currentIndex.value];
  file.value = song.file;
  songInfo.value = song;
};

const playPreviousSong = () => {
  if (isFirstSong()) {return;}
  currentIndex.value = currentIndex.value - 1;
  const song = playlist.value[currentIndex.value];
  file.value = song.file;
  songInfo.value = song;
};
</script>
