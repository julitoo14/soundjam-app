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
          <h5 class="modal-title">Create A New Playlist</h5>
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
            <div class="mb-3">
              <label for="name" class="form-label">Playlist Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="name"
              />
            </div>
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
                <button class="btn btn-success" @click="addPlaylist">Add Playlist</button>
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
import { savePlaylist } from "../composables/apiServices";
const props = defineProps({
  show: false,
});
const emit = defineEmits(["close", "update"]);

const modal = ref(null);
const name = ref("");
const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
const Userid = decoded.id;
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

const addPlaylist = async () => {
  try {
    await savePlaylist(name.value, Userid)
    showAlert("success", "Playlist Added Successfully");
    close();
    emit("update");
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const close = () => {
  emit("close");
};

onMounted(() => {
  const modalElement = modal.value;
  modalElement.addEventListener("click", (event) => {
    if (event.target === modalElement) {
      close();
    }
  });
});
</script>

<style scoped>
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

</style>
