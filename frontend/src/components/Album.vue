<template>
  <RouterLink class="nav-link" :to="`/album/${props.album._id}`">
    <div class="album-card">
      <img :src="props.albumImage" alt="Album Cover" />
        <div class="name" >{{album.title}}</div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  album: {
    type: Object,
    required: true,
  },
  albumImage: "",
});

const album = ref(props.album);
</script>

<style scoped>

.name{
  white-space: nowrap;      /* Evita que el texto se rompa en varias líneas */
  overflow: hidden;         /* Oculta el texto que sobrepasa el límite de ancho */
  text-overflow: ellipsis;  /* Muestra los tres puntos (...) al final del texto */
  width: 120px;
}

.album-card {
  margin: 0 auto;
  text-align: center;
  background-color: var(--darker-background-color);
  display: flex;
  flex-direction: column;
  gap: 2em;
  padding: 1em 1.5em;
}

.album-card:hover {
  background-color: var(--darker-background-color-hover);
}

.album-card img {
  width: 8em;
  height: 8em;
}

.name h3 {
  font-size: 1em;
  text-align: start;

}

@media (max-width: 768px) {

  .album-card{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 90%;
  }

  .album-card img {
    width: 50px;
    height: 50px;
  }

  .name {
    width: 100px;
  }
}

</style>
