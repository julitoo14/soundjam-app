<template>
  <RouterLink class="nav-link" :to="`/album/${props.album._id}`">
    <div class="flex flex-col items-center text-center gap-2 bg-gray-900 rounded-lg">
      <!-- Imagen con LazyImage -->
      <LazyImage
        class="object-cover flex-shrink-0"
        :src="props.albumImage"
        alt="Album Cover"
      />
      <!-- Título del álbum -->
      <div
        class="text-white text-sm truncate w-32"
        title="{{ props.album.title }}"
      >
        {{ props.album.title }}
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";
import LazyImage from "./LazyImage.vue";

const props = defineProps({
  album: {
    type: Object,
    required: true,
  },
  albumImage: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* Si necesitas algo adicional, lo podés agregar aquí */
</style>
