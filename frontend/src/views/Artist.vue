<template>
  <div class=" bg-gray-950 mx-auto p-2 w-full md:w-4/5 text-white animate-fadeIn">
    <!-- Artist Info Section -->
    <div class="w-full">
      <div class="flex flex-col md:flex-row justify-center md:justify-start items-center gap-6">
        <img
          :src="image"
          alt="Artist Image"
          class=" w-48 h-48 object-cover rounded-lg shadow-lg"
        />
        <div class="text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
            {{ artist.name }}
          </h1>
          <p class="text-gray-300 text-lg leading-relaxed">
            {{ artist.description }}
          </p>
          <!-- Admin Controls -->
          <div v-if="admin" class="flex flex-wrap gap-2 mt-4">
            <RouterLink
              :to="`/createAlbum/${artist._id}`"
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Create Album
            </RouterLink>
            <RouterLink
              :to="`/editArtist/${artist._id}`"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Edit Artist
            </RouterLink>
            <button
              @click="showDeleteModal = true"
              class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Remove Artist
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Albums Section -->
    <div class="w-full mt-4 ">
      <div class=" rounded-lg shadow-lg ">
        <h2 class="text-3xl font-bold text-purple-600 text-center md:!text-left mb-4">
          Albums
        </h2>
        <div v-if="albums.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Album
            v-for="album in albums"
            :key="album._id"
            :album="album"
            :albumImage="`${API_BASE_URL}/album/image/${album.image}`"
            class=" hover:bg-gray-600 hover:scale-105 transition duration-300"
          />
        </div>
        <div v-else class="text-center text-gray-300 text-lg mt-6">
          No albums found
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      :show="showDeleteModal"
      @delete="removeArtist(artistId), (showDeleteModal = false)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Album from "../components/Album.vue";
import { deleteArtist, getArtist, getAlbumsByArtist } from "../composables/apiServices";
import DeleteModal from "../components/DeleteModal.vue";
import { API_BASE_URL } from "../../config";

const router = useRouter();
const route = useRoute();
const admin = ref(false);
const artistId = route.params.id;
const artist = ref({});
const image = ref("");
const albums = ref([]);
const showDeleteModal = ref(false);

const removeArtist = async () => {
  try {
    await deleteArtist(artist.value._id);
    router.push("/artists");
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getArtistData = async () => {
  try {
    const res = await getArtist(artistId);
    artist.value = res.artist;
    image.value = `${API_BASE_URL}/artist/image/${artist.value.image}`;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

const getAlbums = async () => {
  try {
    const res = await getAlbumsByArtist(artistId);
    albums.value = res.albums;
  } catch (error) {
    console.log(error.response.data.message);
  }
};

onMounted(() => {
  getArtistData();
  getAlbums();
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role === "role_admin") {
    admin.value = true;
  }
});
</script>

<style scoped>
/* Animación suave para el modal */
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
