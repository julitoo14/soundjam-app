import { createRouter, createWebHistory } from "vue-router";
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Profile from './views/Profile.vue';
import CreateArtist from './views/CreateArtist.vue';
import Artist from './views/Artist.vue';
import EditArtist from './views/EditArtist.vue';
import Album from './views/Album/Album.vue';
import CreateAlbum from './views/Album/CreateAlbum.vue';
import EditAlbum from './views/Album/EditAlbum.vue';
import AddSong from './views/Song/AddSong.vue';
import EditSong from './views/Song/EditSong.vue';
import Playlist from './views/Playlist.vue';
import EditUser from './views/EditUser.vue';
import Library from './views/Library.vue';


const routes = [
    {
        path: "/register",
        component: Register
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: '/',
        component: Home,
        meta: {
            requiresAuth: true
        }
    }, 
    {
        path: '/profile/:id',
        component: Profile,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/createArtist',
        component: CreateArtist,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/artist/:id',
        component: Artist,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editArtist/:id',
        component: EditArtist,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/album/:id',
        component: Album,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/createAlbum/:artistId',
        component: CreateAlbum,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editAlbum/:id',
        component: EditAlbum,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/addSong/:albumId',
        component: AddSong,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editSong/:id',
        component: EditSong,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/playlist/:id',
        component: Playlist,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/editUser/:id',
        component: EditUser,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/library',
        component: Library,
        meta: {
            requiresAuth: true
        }
    },


]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    if (to.meta.requiresAuth && !token) {
      next("/login");
    } else if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const expirationDate = new Date(decodedToken.exp);
      if (expirationDate <= new Date()) {
        localStorage.removeItem("token");
        next("/login");
      } else {
        next();
      }
    } else {
      next();
    }
  });
  

  export { router };