<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-4 border-purple-600 flex justify-between items-center px-4 py-2 h-24">
    <div class="flex items-center space-x-4">
      <img
        v-if="!isMobile"
        :src="`${API_BASE_URL}/album/image/${cover}`"
        alt="Album Cover"
        class="w-16 h-16 rounded-lg object-cover"
      />
      <div class="overflow-hidden">
        <h4 class="text-white truncate font-medium">{{ getSongInfo() }}</h4>
        <h5 v-if="!isMobile" class="text-gray-400 truncate">{{ artist }}</h5>
      </div>
    </div>

    <div class="flex flex-col items-center w-1/2 space-y-2">
      <div class="flex items-center justify-center space-x-4">
        <PreviousIcon class="w-10 h-10 text-white cursor-pointer" @click="previousSong" />
        <PlayIconVue
          v-if="!isPlaying"
          class="w-10 h-10 text-white cursor-pointer"
          @click="togglePlay"
        />
        <PauseIconVue
          v-else
          class="w-10 h-10 text-white cursor-pointer"
          @click="togglePlay"
        />
        <NextIcon class="w-10 h-10 text-white cursor-pointer" @click="nextSong" />
      </div>
      <div class="flex items-center justify-between w-full text-white text-sm">
        <span>{{ formatTime(currentTime) }}</span>
        <input
          class="w-full h-2 bg-gray-500 rounded-lg appearance-none focus:outline-none"
          type="range"
          min="0"
          :max="duration"
          v-model="currentTime"
          @mousedown="onSliderStart"
          @mouseup="onSliderEnd"
          @touchstart="onSliderStart"
          @touchend="onSliderEnd"
        />
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>

    <div v-if="!isMobile" class="w-1/4 flex items-center justify-end">
      <input
        type="range"
        class="w-2/3 h-2 bg-gray-500 rounded-lg appearance-none focus:outline-none"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
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

const isMobile = ref(window.innerWidth < 1000);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 1000;
};

const updateTime = () => {
  currentTime.value = audio.value.currentTime;
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

watch(volume, (newVolume) => {
  audio.value.volume = newVolume;
});

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
});
</script>

<style scoped>
.border-primary {
  border-color: var(--primary-color);
}
</style>
