<template>
    <div
      class="modal fade"
      :class="{ show: show }"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
      ref="modal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">In Which Playlist Do You Want To Add Your Song? {{ props.songId }}</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div v-if="!showError" class="mb-3">
                <label for="playlist" class="form-label">Select Playlist </label>
                <select class="form-control" id="playlist" v-model="selectedPlaylist">
                  <option v-for="playlist in playlists" :key="playlist.id" :value="playlist._id">{{ playlist.name }}</option>
                </select>
              </div >
              <h5 v-else class="text-danger">You Dont Have Playlists! You can make one in your profile</h5>
            </form>
          </div>
          <div class="modal-footer">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                @click="$emit('close')"
              >
                Close
              </button>
              <button class="btn btn-success" @click="addSongToPlaylist()">
                Add Song
              </button>
            </div>
  
            <Alert
              :show="alert.show"
              :type="alert.type"
              :message="alert.message"
              @close="alert.show = false"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from "vue";
  import Alert from "./Alert.vue";
  import { getPlaylistsByUser, addSongToAPlaylist } from "../composables/apiServices";
  const props = defineProps({
    show: false,
  });
  const emit = defineEmits(["close", "update"]);
  
  const modal = ref(null);
  const selectedPlaylist = ref(null);
  const playlists = ref([]);
  const showError = ref(false);
  const alert = reactive({
    type: "",
    message: "",
    show: false,
  });
  
  const showAlert = (type, message) => {
    alert.type = type;
    alert.message = message;
    alert.show = true;
  };
  
  const addSongToPlaylist = async () => {
    const songId = localStorage.getItem("songId");
    try {
        const response = await addSongToAPlaylist(selectedPlaylist.value, songId)
        showAlert("info", response.message);
        } catch (err) {
        if(selectedPlaylist.value){
            showAlert("danger", err);
        } else {
            showAlert("danger", "You must select a playlist");
        }
    } 
  };
  
  const close = () => {
    emit("close");
  };

  const getPlaylists = async () => {
  const id = localStorage.getItem("id");
  try {
    const res = await getPlaylistsByUser(id)
    playlists.value = res.playlists;
    if (playlists.value.length == 0) {
      showError.value = true;
    }

  } catch (err) {
    showAlert(err.response.data.message, "danger");
  }
};
  
  onMounted(() => {
    getPlaylists(); 
    const modalElement = modal.value;
    modalElement.addEventListener("click", (event) => {
      if (event.target === modalElement) {
        close();
      }
    });
  });
  </script>
  
  <style scoped>
  .modal-backdrop {
    opacity: 0.5 !important;
  }
  
  .modal {
    display: block !important;
    background-color: rgba(100, 98, 98, 0.5);
    z-index: 9999;
  }
  
  .modal-dialog {
    margin: 10% auto;
  }
  
  .modal-content {
    background-color: #000000;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(53, 52, 52, 0.5);
    border: white solid 3px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  .modal-header h5 {
    margin: 0;
  }
  
  .modal-body {
    padding: 10px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ccc;
  }

  @media (max-width: 768px) {
    .modal{
      margin-top: 3em;
    }
  }
  

  </style>
