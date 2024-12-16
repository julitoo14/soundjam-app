<template>
  <nav class="w-full bg-gray-900 flex items-center justify-center h-12 md:top-0 md:h-16 md:px-6 z-50">
    <div class="absolute left-4 md:left-6">
      <img src="/logo.png" alt="logo" class="w-10 h-10" />
    </div>
    <ul class="flex items-center gap-x-12 justify-center w-full md:w-auto md:gap-6">
      <li>
        <RouterLink to="/" class="flex items-center gap-2 text-white ">
          <HomeIcon />
          <span class="hidden hover:text-purple-600 md:inline text-sm">Home</span>
        </RouterLink>
      </li>
      <li v-if="admin">
        <RouterLink to="/createArtist" class="flex items-center gap-2 text-white hover:text-gray-300">
          <Add />
          <span class="hidden hover:text-purple-600 md:inline text-sm">Create Artist</span>
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="`/profile/${id}`" class="flex items-center gap-2 text-white hover:text-gray-300">
          <ProfileIcon />
          <span class="hidden hover:text-purple-600 md:inline text-sm">Profile</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { watch, ref, onMounted } from "vue";
import HomeIcon from "../assets/icons/HomeIcon.vue";
import ProfileIcon from "../assets/icons/ProfileIcon.vue";
import Add from "../assets/icons/Add.vue";

const admin = ref(false);
const logged = ref("");
const nick = ref("");
const id = localStorage.getItem("id");
const userImage = ref(null);

onMounted(async () => {
  nick.value = localStorage.getItem("nick");
  const token = localStorage.getItem("token");

  if (localStorage.getItem("token")) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const role = decoded.role;
    userImage.value = decoded.image;
    if (role == "role_admin") {
      admin.value = true;
    }
    logged.value = true;
  } else {
    logged.value = false;
  }
});

watch(logged, (newVal) => {
  logged.value = newVal;
});
</script>

<style scoped>
svg {
  width: 1.7em;
  height: 1.7em;
}
</style>