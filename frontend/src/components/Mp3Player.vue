<template>
  <div
    v-bind="$attrs"
    class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-4 border-purple-600 grid grid-cols-[auto,1fr,auto] items-center px-4 py-2 h-24"
  >
    <div v-if="getSongInfo()" class="flex items-center space-x-4">
      <div class="relative w-16 h-16">
        <div v-if="loadingImage" class="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
          <span class="loader"></span>
        </div>
        <img
          v-show="!loadingImage"
          :src="`${API_BASE_URL}/album/image/${cover}`"
          alt="Album Cover"
          class="w-16 h-16 rounded-lg object-cover cursor-pointer"
          @load="loadingImage = false"
          @error="loadingImage = false; cover = 'default.png'"
          @click="$router.push(`/album/${album._id}`)"

        />
      </div>
      <div class="overflow-hidden">
        <h4 class="text-white truncate font-medium" aria-label="Song name">{{ getSongInfo() }}</h4>
        <h5 v-if="!isMobile" class="text-gray-400 truncate" aria-label="Artist">{{ artist }}</h5>
      </div>
    </div>

    <div v-else>
      <img src="/logo.png" class="h-16 w-16 mr-3"/>
    </div>

    <div class="flex flex-col items-center justify-center">
      <div class="flex items-center justify-center space-x-4">
        <button class="w-10 h-10 text-white cursor-pointer" @click="previousSong" aria-label="Previous song">
          <PreviousIcon />
        </button>
        <button
          v-if="!isPlaying"
          class="w-10 h-10 text-white cursor-pointer"
          @click="togglePlay"
          aria-label="Play"
        >
          <PlayIconVue />
        </button>
        <button
          v-else
          class="w-10 h-10 text-white cursor-pointer"
          @click="togglePlay"
          aria-label="Pause"
        >
          <PauseIconVue />
        </button>
        <button class="w-10 h-10 text-white cursor-pointer" @click="nextSong" aria-label="Next song">
          <NextIcon />
        </button>
      </div>
      <div class="flex items-center gap-x-3 justify-center w-full text-white text-sm">
        <span>{{ formatTime(currentTime) }}</span>
        <input
          class="w-full h-2 bg-gray-500 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-purple-600 transition"
          type="range"
          min="0"
          :max="duration"
          v-model="currentTime"
          @input="seekAudio"
          aria-label="Song progress"
        />
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>

    <div v-if="!isMobile" class="flex items-center justify-end">
      <input
        type="range"
        class="w-2/3 h-2 bg-gray-500 rounded-lg appearance-none focus:outline-none focus:ring focus:ring-purple-600 transition"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
        aria-label="Volume control"
      />
    </div>
  </div>

  <audio
    ref="audio"
    autoplay
    @ended="ended"
    :src="props.files"
    @timeupdate="updateTime"
    @loadedmetadata="loadedMetadata"
    @error="handleAudioError"
    @play="isPlaying = true"
    @pause="isPlaying = false"
  ></audio>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import PlayIconVue from "../assets/icons/PlayIcon.vue";
import PauseIconVue from "../assets/icons/PauseIcon.vue";
import NextIcon from "../assets/icons/NextIcon.vue";
import PreviousIcon from "../assets/icons/PreviousIcon.vue";
import { getAlbum } from "../composables/apiServices";
import { API_BASE_URL } from "../../config";

const props = defineProps({
  files: {
    required: true,
    type: String,
  },
  song: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["ended", "next", "previous"]);

const audio = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const album = ref("");
const cover = ref("default.png");
const artist = ref("");
const loadingImage = ref(true);
const isPlaying = ref(false);

const isMobile = ref(window.innerWidth < 1000);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 1000;
};

const updateTime = () => {
  currentTime.value = audio.value.currentTime;
};

const seekAudio = () => {
  audio.value.currentTime = currentTime.value;
};

const loadedMetadata = () => {
  duration.value = audio.value.duration;
  fetchAlbum();
};

const getSongInfo = () => {
  if (props.song) {
    return `${props.song.name}`;
  }
  return "";
};

const fetchAlbum = async () => {
  if (props.song) {
    try {
      const res = await getAlbum(props.song.album._id);
      album.value = res.album;
      cover.value = album.value.image;
      artist.value = res.album.artist.name;
    } catch (err) {
      console.log(err);
    } finally {
      loadingImage.value = false;
    }
  }
};

const togglePlay = () => {
  if (audio.value.paused) {
    audio.value.play();
  } else {
    audio.value.pause();
  }
};

const ended = () => {
  emit("ended");
};

const previousSong = () => {
  emit("previous");
};

const nextSong = () => {
  emit("next");
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const handleAudioError = () => {
  console.error("Error loading audio file.");
  isPlaying.value = false;
};

watch(volume, (newVolume) => {
  audio.value.volume = newVolume;
});

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
});
</script>
