<template>
  <div class="min-h-screen bg-gray-950 pt-20 px-4 sm:px-6 lg:px-8">
    <!-- Barra de búsqueda -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchTerm"
          @input="handleSearch"
          placeholder="Buscar álbumes..."
          class="w-full bg-gray-800 text-gray-100 rounded-full px-6 py-3 pl-12 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
        />
        <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-7xl mx-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 gap-y-6">
        <div v-for="n in 12" :key="n" class="animate-pulse">
          <div class="bg-gray-800 rounded-lg aspect-square"></div>
          <div class="h-4 bg-gray-800 rounded mt-2 w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Grid de álbumes -->
    <div v-else-if="albums.length > 0" class="max-w-7xl mx-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 gap-y-6">
        <Album
          v-for="album in albums"
          :key="album._id"
          :album="album"
          :albumImage="`${API_BASE_URL}/album/image/${album.image}`"
          class="bg-gray-900 p-2 rounded-lg animate-fadeIn hover:scale-105 transition"
        />
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="max-w-7xl mx-auto text-center text-gray-400 py-12">
      No se encontraron álbumes
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getAlbumsBySearch } from '../composables/apiServices';
import { API_BASE_URL } from '../../config';
import Search from '../assets/icons/Search.vue';
import Album from '../components/Album.vue';

const searchTerm = ref('');
const albums = ref([]);
const isLoading = ref(true);
let searchDebounceTimer = null;

const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const handleSearch = () => {
  clearTimeout(searchDebounceTimer);
  isLoading.value = true;

  searchDebounceTimer = setTimeout(async () => {
    try {
      const response = await getAlbumsBySearch(searchTerm.value);
      if (response && response.albums) {
        albums.value = searchTerm.value ? 
          response.albums : 
          shuffleArray(response.albums).slice(0, 12);
      } else {
        albums.value = [];
      }
    } catch (error) {
      console.error('Error buscando álbumes:', error);
      albums.value = [];
    } finally {
      isLoading.value = false;
    }
  }, 300);
};

const loadInitialAlbums = async () => {
  try {
    isLoading.value = true;
    const response = await getAlbumsBySearch('');
    if (response && response.albums) {
      albums.value = shuffleArray(response.albums).slice(0, 12);
    } else {
      albums.value = [];
    }
  } catch (error) {
    console.error('Error cargando álbumes:', error);
    albums.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadInitialAlbums();
});

onBeforeUnmount(() => {
  clearTimeout(searchDebounceTimer);
});
</script>