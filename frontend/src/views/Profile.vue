<template>
  <div class="bg-gray-900 min-h-screen">
    <!-- Header Section -->
    <div class="w-full md:w-3/4 m-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 bg-gray-800">
      <img class="w-48 h-48 md:w-32 md:h-32 rounded-full md:mx-0" :src="avatarUrl" alt="Avatar" />
      <div class="text-center md:text-left">
        <p class="text-purple-600 text-lg">Perfil</p>
        <h1 class="text-4xl font-bold text-white">{{ user.name }}</h1>
        <h3 class="text-gray-400">{{ user.nick }} ~ {{ user.email }}</h3>
      </div>
      <div class="flex flex-col md:flex-row md:justify-end items-center space-y-2 md:space-y-0 md:space-x-4">
        <RouterLink
          :to="`/editUser/${id}`"
          class="px-4 py-2 bg-transparent text-purple-600 text-center hover:text-white"
        >
          Edit User
        </RouterLink>
        <span class="text-purple-600">|</span>
        <button
          @click="signOut"
          class="px-4 py-2 bg-transparent text-purple-600 hover:text-white text-center"
        >
          Sign Out
        </button>
      </div>
    </div>

    <!-- Playlists Section -->
    <div class="container mx-auto mt-8 w-full md:w-3/4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-white">Playlists</h1>
        <button
          @click="showAddPlaylist"
          class="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-500"
        >
          New Playlist
        </button>
      </div>
      <table v-if="showTable" class="w-full text-left border-collapse bg-gray-800 text-gray-300">
        <thead>
          <tr>
            <th class="border-b border-gray-600 px-4 py-2">Playlist Name</th>
            <th class="border-b border-gray-600 px-4 py-2">Number of Songs</th>
            <th class="border-b border-gray-600 px-4 py-2">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="playlist in playlists" :key="playlist._id" class="hover:bg-gray-700 cursor-pointer" @click="() => router.push(`/playlist/${playlist._id}`)">
            <td class="border-b border-gray-600 px-4 py-2">{{ playlist.name }}</td>
            <td class="border-b border-gray-600 px-4 py-2">{{ playlist.songs.length }}</td>
            <td class="border-b border-gray-600 px-4 py-2">
              <div class="grid grid-cols-2 gap-2">
                <button
                  @click="() => { showDeleteModal = true; playlistToDelete = playlist._id }"
                  class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-center"
                >
                  Remove
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <AddPlaylist
      v-if="showPlaylistModal"
      @close="showPlaylistModal = false"
      :show="showPlaylistModal"
      @update="fetchPlaylists()"
    />
    <DeleteModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      :show="showDeleteModal"
      @delete="removePlaylist(playlistToDelete); showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import AddPlaylist from "../components/AddPlaylist.vue";
import { deletePlaylist, getPlaylistsByUser, getUserProfile } from "../composables/apiServices";
import DeleteModal from "../components/DeleteModal.vue";
import { API_BASE_URL } from "../../config";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const user = ref({});
const avatarUrl = ref("");
const showPlaylistModal = ref(false);
const showDeleteModal = ref(false);
const playlistToDelete = ref("");
const showTable = ref(true);
const playlists = ref([]);
const alert = reactive({
  show: false,
  message: "",
  type: "danger",
});

const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nick");
  localStorage.removeItem("id");
  router.go("/login");
};

const fetchUser = async () => {
  try {
    const res = await getUserProfile(id);
    user.value = res.user;
    avatarUrl.value = `${API_BASE_URL}/user/avatar/${user.value.image}`;
  } catch (err) {
    console.log(err.message);
  }
};

const showAddPlaylist = () => {
  showPlaylistModal.value = true;
};

const showAlert = (message, type) => {
  alert.show = true;
  alert.message = message;
  alert.type = type;
};

const fetchPlaylists = async () => {
  try {
    const res = await getPlaylistsByUser(id);
    playlists.value = res.playlists;
    showTable.value = playlists.value.length > 0;
  } catch (err) {
    showAlert(err.message, "danger");
  }
};

const removePlaylist = async (id) => {
  try {
    await deletePlaylist(id);
    await fetchPlaylists();
  } catch (err) {
    console.log(err.message);
  }
};

onMounted(async () => {
  await fetchPlaylists();
  await fetchUser();
});
</script>

<style>
</style>
