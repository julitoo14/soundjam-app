<template>
  <!-- Modal Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
    @click.self="close"
    ref="modal"
  >
    <!-- Modal Content -->
    <div class="bg-gray-800 text-white rounded-lg shadow-lg max-w-lg w-full animate-fadeIn">
      <!-- Modal Header -->
      <div class="flex justify-between items-center border-b border-gray-700 px-6 py-4">
        <h4 class="text-lg font-semibold">Add Song to Playlist</h4>
        <button
          @click="close"
          class="text-gray-400 hover:text-white transition duration-200 text-2xl"
        >
          &times;
        </button>
      </div>

      <!-- Modal Body -->
      <div class="px-6 py-4">
        <form>
          <div v-if="!showError" class="mb-4">
            <label for="playlist" class="block text-gray-300 mb-2">Select Playlist</label>
            <select
              id="playlist"
              v-model="selectedPlaylist"
              class="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option
                v-for="playlist in playlists"
                :key="playlist.id"
                :value="playlist._id"
              >
                {{ playlist.name }}
              </option>
            </select>
          </div>
          <h5 v-else class="text-red-500 text-center">
            You don't have playlists! Create one in your profile.
          </h5>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-2 border-t border-gray-700 px-6 py-4">
        <button
          @click="close"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition duration-300"
        >
          Close
        </button>
        <button
          @click="addSongToPlaylist"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition duration-300"
        >
          Add Song
        </button>
      </div>

      <!-- Alert Component -->
      <Alert
        v-if="alert.show"
        :show="alert.show"
        :type="alert.type"
        :message="alert.message"
        @close="alert.show = false"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import Alert from "./Alert.vue";
import { getPlaylistsByUser, addSongToAPlaylist } from "../composables/apiServices";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "update"]);

const modal = ref(null);
const selectedPlaylist = ref(null);
const playlists = ref([]);
const showError = ref(false);
const alert = reactive({
  type: "",
  message: "",
  show: false,
});

const showAlert = (type, message) => {
  alert.type = type;
  alert.message = message;
  alert.show = true;
};

const addSongToPlaylist = async () => {
  const songId = localStorage.getItem("songId");
  try {
    const response = await addSongToAPlaylist(selectedPlaylist.value, songId);
    showAlert("info", response.message);
  } catch (err) {
    if (selectedPlaylist.value) {
      showAlert("danger", err);
    } else {
      showAlert("danger", "You must select a playlist");
    }
  }
};

const close = () => {
  emit("close");
};

const getPlaylists = async () => {
  const id = localStorage.getItem("id");
  try {
    const res = await getPlaylistsByUser(id);
    playlists.value = res.playlists;
    if (playlists.value.length === 0) {
      showError.value = true;
    }
  } catch (err) {
    showAlert("danger", err.response.data.message);
  }
};

onMounted(() => {
  getPlaylists();
});
</script>

<style scoped>
/* Animación de aparición */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
