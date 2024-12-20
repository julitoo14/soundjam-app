<template>
    <RouterLink class="nav-link" @click="console.log(props.artist)" :to="`/artist/${props.artist._id}`">
      <div class="flex flex-col items-center text-center gap-2 rounded-lg">
        <LazyImage
        class="object-cover flex-shrink-0"
        :src="props.artistImage"
        alt="Album Cover"
        />
          <div class="text-white text-sm truncate w-32" >{{artist.name}}</div>
      </div>
    </RouterLink>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import LazyImage from "./LazyImage.vue";
  
  const props = defineProps({
    artist: {
      type: Object,
      required: true,
    },
    artistImage: "",
  });
  
  const artist = ref(props.artist);
  </script>
  
  <style scoped>
  .name{
    white-space: nowrap;      /* Evita que el texto se rompa en varias líneas */
    overflow: hidden;         /* Oculta el texto que sobrepasa el límite de ancho */
    text-overflow: ellipsis;  /* Muestra los tres puntos (...) al final del texto */
    width: 120px;
  }

  .artist-card {
    margin: 0 auto;
    text-align: center;
    background-color: var(--darker-background-color);
    display: flex;
    flex-direction: column;
    gap: 2em;
    padding: 1em 1.5em;
  }

  .artist-card:hover {
    background-color: var(--darker-background-color-hover);
  }

  .artist-card img {
    width: 8em;
    height: 8em;
  }
  
  .name h3 {
    font-size: 1em;
    text-align: start;
  
  }

  @media (max-width: 768px) {

    .artist-card{
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 90%;
    }

    .artist-card img {
      width: 50px;
      height: 50px;
    }

    .name {
      width: 100px;
    }
  }

  </style>
  