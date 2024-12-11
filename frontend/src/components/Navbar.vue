<template>
  <nav class="navbar">
      <Div class="logo-div">
        <img src="/logo.png" alt="logo" class="logo">
      </Div>
      <ul class="navbar-nav">
        <li>
          <RouterLink
            class="link"
            to="/"
          >
            <HomeIcon />
            <span class="navbar-text">Home</span>
          </RouterLink>
        </li>

        <li v-if="admin">
          <RouterLink
              class="link"
              to="/createArtist"
          >
            <Add />
            <span class="navbar-text">Create Artist</span>
          </RouterLink>
        </li>

        <li>
          <RouterLink
            class="link"
            :to="`/profile/${id}`"
          >
            <ProfileIcon />
            <span class="navbar-text">Profile</span>
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
import LoginIcon from "../assets/icons/LoginIcon.vue";
import Add from "../assets/icons/Add.vue";
import Search from "../assets/icons/Search.vue";
import LibraryIcon from "../assets/icons/LibraryIcon.vue";
import Settings from "../assets/icons/Settings.vue";

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

h2{
    color: white;
}

.navbar {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: var(--background-color);
  position: fixed;
  bottom: 0;
  z-index: 10000;
  height: 40px;
}

.navbar-text{
  text-decoration: none;
  color: white;
  font-size: 1em;
  display: none;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
}


svg{
    width: 1.7em;
    height: 1.7em;
}

.logo{
  display: none;
}



@media screen and (min-width: 768px) {
  .logo{
    display: block;
    width: 50px;
    height: 50px;
  }

  .logo-div{
    width: 20%;
    position: absolute;
    left: 20px;

  }

  .navbar {
    top: 0;
    height: 80px;
    align-items: center;
    padding: 0 20px;
  }

  .navbar-nav {
    justify-content: space-between;
    width: 20%;
    margin: auto;
    gap: 1em;
  }

  .navbar-text{
    display: block;
  }

  .link{
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
  }



}


</style>
