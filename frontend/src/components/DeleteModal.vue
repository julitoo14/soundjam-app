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
          <h4 class="modal-title">Are you sure?</h4>
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
        <div class="modal-footer">
          <div class="btn-group">
              <button class="btn btn-success" @click="$emit('delete')">
                Yes
              </button>
            <button
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";


  const props = defineProps({
    show: false,
  });
  const emit = defineEmits(["close", "update"]);
  const modal = ref(null);

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

  @media (max-width: 768px) {
    .modal{
      margin-top: 3em;
    }
  }
  

  </style>