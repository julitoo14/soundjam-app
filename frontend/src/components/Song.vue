<template>
  <tbody>
  <tr class="song" @click="$emit('playSong')">
    <th v-if="props.track">{{ song.track }}</th>
    <td style="font-size: 1.5em; text-align:left">{{ song.name }}</td>
    <td v-if="!isMobile" style="font-size: 1.1em; text-align:left">{{ song.duration }}</td>
    <td>
      <!-- Dropdown de los tres puntos -->
      <div class="dropdown">
        <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            @click.stop
        >
          •••
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <!-- Opciones según el tipo de vista -->
          <li v-if="playlistview">
            <button class="dropdown-item" @click="$emit('removeSong')">Delete</button>
          </li>
          <li v-else-if="admin">
            <button
                class="dropdown-item"
                @click.stop="$emit('addSong', selectSong())"
            >
              Add Song
            </button>
            <RouterLink class="dropdown-item" :to="`/editSong/${song._id}`">
              Edit Song
            </RouterLink>
            <button class="dropdown-item" @click="$emit('removeSong')">
              Delete
            </button>
          </li>
          <li v-else>
            <button
                class="dropdown-item"
                @click.stop="$emit('addSong', selectSong())"
            >
              Add Song
            </button>
          </li>
        </ul>
      </div>
    </td>
  </tr>
  </tbody>
</template>

<style scoped>
.song {
  cursor: pointer;
  border: rgba(30, 29, 29, 0.22) 1px solid;
}

td {
  background-color: var(--darker-background-color);
  color: white;
  text-align: center;
  border: none;
}

th {
  background-color: var(--darker-background-color);
  color: white;
  text-align: center;
  font-size: 1.6em;
  border: none;
}

tr:hover td,
tr:hover th {
  background-color: var(--darker-background-color-hover);
}

td,
th {
  padding: 10px;
}

.dropdown-toggle {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
}

.dropdown-menu {
  background-color: var(--background-color);
  color: white;
}

.dropdown-item {
  color: white;
  background-color: var(--background-color);
  border: none;
}
</style>



<script setup>
import { onMounted, ref } from "vue";
import AddIcon from "../assets/icons/AddIcon.vue";
import Pencil from "../assets/icons/Pencil.vue";
import Delete from "../assets/icons/Delete.vue";
const admin = ref(false);
const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  track: {
    type: Boolean,
    default: true,
  },
  playlistview: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["removeSong", "playSong", "getSongId", "addSong"]);

const selectSong = () => {
  localStorage.setItem('songId', props.song._id) 
};

onMounted(() => {
  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;
  if (role == "role_admin") {
    admin.value = true;
  }
});
</script>


