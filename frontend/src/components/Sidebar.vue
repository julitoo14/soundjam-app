<template>
  <div class="sidebar d-flex flex-column flex-shrink-0">
    <RouterLink
      class="d-flex align-items-center p-3 mb-3 mb-md-0 me-md-auto link-light text-decoration-none flex-wrap justify-content-center"
      to="/"
    >
      <img class="logo" src="/logo.png" alt="" />
      <h2 class="m-2">SoundJam</h2>
    </RouterLink>
    <hr />

    <ul v-if="logged" class="p-3 nav nav-pills flex-column mb-auto">
      <li>
        <RouterLink
          class="link d-inline-flex nav-link link-light p-1 align-items-center"
          to="/"
        >
          <HomeIcon/>
          <p class="m-1">Search</p>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          class="link d-inline-flex nav-link link-light p-1 align-items-center"
          :to="`/profile/${id}`"
        >
          <ProfileIcon />
          <p class="m-1">Profile</p>
        </RouterLink>
      </li>
      <li v-if="admin">
        <RouterLink
          class="link d-inline-flex nav-link link-light p-1 align-items-center"
          to="/createArtist"
        >
          <Add />
          <p class="m-1">Add Artist</p>
        </RouterLink>
      </li>
    </ul>

    <ul v-else class="p-3 nav nav-pills flex-column mb-auto">
      <li>
        <RouterLink
          class="link d-inline-flex nav-link link-light p-1 align-items-center"
          to="/login"
        >
          <LoginIcon />
          <p class="m-1">Sign In</p>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          class="link d-inline-flex nav-link link-light p-1 align-items-center"
          to="/register"
        >
          
          <p class="m-1">Sign Up</p>
        </RouterLink>
      </li>
    </ul>

    <hr v-if="logged" />

    <div v-if="logged" class="dropdown p-4">
      <a
        href="#"
        class="d-flex align-items-center link-light text-decoration-none dropdown-toggle"
        id="dropdownUser"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          :src="`${API_BASE_URL}/user/avatar/${userImage}`"
          width="32"
          height="32"
          class="rounded-circle me-2"
        />
        <strong>{{ nick }}</strong>
      </a>

      <ul class="dropdown-menu shadow bg-dark" aria-labelledby="dropdownUser">
        <li>
          <RouterLink class="link-light dropdown-item" :to="`/profile/${id}`"
            >Profile</RouterLink
          >
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <RouterLink class="link-light dropdown-item" @click="signOut" to="/login"
            >sign Out</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { RouterLink} from "vue-router";
import { watch, ref, onMounted } from "vue";
import HomeIcon from "../assets/icons/HomeIcon.vue";
import LibraryIcon from "../assets/icons/LibraryIcon.vue";
import ProfileIcon from "../assets/icons/ProfileIcon.vue";
import LoginIcon from "../assets/icons/LoginIcon.vue";
import Add from "../assets/icons/Add.vue";
import { API_BASE_URL } from "../../config";

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

const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nick");
  localStorage.removeItem("id");
  logged.value = false;
  router.push("/login");
};

watch(logged, (newVal) => {
  logged.value = newVal;
});
</script>

<style scoped>
h2 {
  font-size: 1.5em;
}

.dropdown {
  width: 50%;
}
.nav-link:hover {
  cursor: pointer;
}

.logo {
  width: 3em;
  height: 3em;
}

.sidebar {
  width: 20%;
  background-color: rgb(26, 27, 27);
  height: 90vh;
  position: relative;
}

.link p {
  font-size: 1.6em;
}
  
</style>
