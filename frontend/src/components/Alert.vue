<template>
    <div
      v-if="show"
      class="alert"
      :style="{
        backgroundColor: backgroundColor,
      }"
    >
      <div class="message">{{ message }}</div>
      <div class="close-alert" @click="$emit('close')">&times;</div>
    </div>
  </template>
  
  <script setup>
  import { useBackgroundColor } from "../composables/useBackgroundColor";
  const props = defineProps({
    message: {
      required: true,
      type: String,
    },
    show: {
      required: true,
      type: Boolean,
    },
    type: {
      required: false,
      default: "danger",
      validator(value) {
        return ["danger", "warning", "info"].includes(value);
      },
    },
  });
  
  const backgroundColor = useBackgroundColor(props);
  const emit = defineEmits(["close"]);
  </script>
  
  <style scoped>
  .alert {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--error-color);
    border-radius: 10px;
  }
  
  .message{
    background: none;
    font-size: 1em;
  }

  .close-alert {
    font-size: 20px;
    cursor: pointer;
    background: none;
  }
  </style>