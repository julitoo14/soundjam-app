<template>
    <div class="image-wrapper">
      <!-- Placeholder de carga -->
      <div v-if="isLoading" class="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
  
      <!-- Imagen con estado de carga -->
      <img
        :src="src"
        :alt="alt"
        class="loaded-image"
        @load="handleLoad"
        :class="{ hidden: isLoading }"
        draggable="false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Props
  defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: "" },
  });
  
  // Reactive state
  const isLoading = ref(true);
  
  // Methods
  const handleLoad = () => {
    isLoading.value = false; // Desactivar el loader cuando la imagen se cargue
  };
  
  </script>
  
  <style scoped>
  .image-wrapper {
    position: relative;
    width: 100%; /* Ajusta según el diseño */
    aspect-ratio: 1 / 1; /* Mantiene una proporción cuadrada */
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #333; /* Fondo opcional mientras carga */
    overflow: hidden; /* Evita que elementos se desborden */
  }
  
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; /* Igual que la imagen */
    height: 100%; /* Igual que la imagen */
  }
  
  .loader div {
    width: 10px;
    height: 10px;
    margin: 5px;
    background-color: #fff;
    border-radius: 50%;
    animation: bounce 1.5s infinite ease-in-out;
  }
  
  .loader div:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .loader div:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
  
  .loaded-image {
    width: 100%;
    height: auto;
    transition: opacity 0.3s ease;
  }
  
  .hidden {
    opacity: 0;
  }
  </style>
  