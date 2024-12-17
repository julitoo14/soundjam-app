<template>
  <!-- Modal Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
    @click.self="close"
    ref="modal"
  >
    <!-- Modal Content -->
    <div
      class="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md animate-fadeIn"
    >
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-gray-700 px-6 py-4">
        <h5 class="text-lg font-semibold">Create A New Playlist</h5>
        <button
          @click="close"
          class="text-gray-400 hover:text-white transition duration-200"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        <form @submit.prevent="addPlaylist">
          <div class="mb-4">
            <label for="name" class="block text-gray-300 text-sm mb-2">Playlist Name</label>
            <input
              type="text"
              id="name"
              v-model="name"
              class="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter playlist name"
            />
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-2 border-t border-gray-700 px-6 py-4">
        <button
          @click="close"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition duration-200"
        >
          Close
        </button>
        <button
          @click="addPlaylist"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition duration-200"
        >
          Add Playlist
        </button>
      </div>

      <!-- Alert -->
      <Alert
        v-if="alert.show"
        :show="alert.show"
        :type="alert.type"
        :message="alert.message"
        @close="alert.show = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Alert from "./Alert.vue";
import { savePlaylist } from "../composables/apiServices";

const props = defineProps({
  show: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "update"]);

const modal = ref(null);
const name = ref("");
const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
const Userid = decoded.id;

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

const addPlaylist = async () => {
  try {
    await savePlaylist(name.value, Userid);
    showAlert("success", "Playlist Added Successfully");
    close();
    emit("update");
  } catch (err) {
    console.log(err.response.data.message);
    showAlert("danger", "Failed to add playlist");
  }
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
/* Animación para el modal */
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
