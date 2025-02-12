<script setup>
import { onMounted, ref } from "vue";
import { useMessageCapsuleStore } from "@/stores/messageCapsules";
import { api, csrfApi } from '@/axios';

const capsuleStore = useMessageCapsuleStore();
const toastMessage = ref('');
const showToast = ref(false);
const error = ref(null);
const showModal = ref(false);
const selectedCapsule = ref(null);
const isEditing = ref(false);
const editedMessage = ref('');

onMounted(() => {
  capsuleStore.fetchCapsules();
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showToastMessage = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
};

const startEditing = () => {
  editedMessage.value = selectedCapsule.value.message;
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  editedMessage.value = '';
};

const saveChanges = async () => {
  try {
    await csrfApi.get('/sanctum/csrf-cookie');
    await api.put(`/message-capsules/${selectedCapsule.value.id}`, {
      message: editedMessage.value
    });
    
    selectedCapsule.value.message = editedMessage.value;
    
    await capsuleStore.fetchCapsules();
    
    isEditing.value = false;
    editedMessage.value = '';
    showToastMessage('Message updated successfully');
  } catch (err) {
    console.error("Error updating capsule:", err.response?.data || err.message);
    error.value = err.response?.data?.Error || "Failed to update capsule.";
    showToastMessage(error.value);
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedCapsule.value = null;
};

const handleCapsuleClick =  async (capsule) => {
  const now = new Date();
  const openingTime = new Date(capsule.scheduledOpeningTime);
  
  if (now >= openingTime) {
    await csrfApi.get('/sanctum/csrf-cookie');
    await api.get(`/message-capsules/${capsule.id}`)
      .then((response) => {

        selectedCapsule.value = response.data;
        showModal.value = true;

      })
      .catch((err) => {
        console.error("Error retrieving capsule:", err.response?.data || err.message);
        error.value = err.response?.data?.Error || "Failed to retrieve capsule.";
      });

  } else {

    const timeRemaining = openingTime - now;
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    showToastMessage(`This capsule is not ready to be opened yet. Time remaining: ${days} days, ${hours} hours, and ${minutes} minutes.`);
  }
};
</script>

<template>
  <div class="min-h-screen w-full bg-[#242424] flex items-center justify-center p-8">

    <div
      v-if="showToast"
      class="fixed top-4 right-4 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg border border-gray-700 transform transition-all duration-300 z-50"
      :class="showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
    >
      <div class="flex items-center space-x-2">
        <svg 
          class="h-5 w-5 text-yellow-400" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fill-rule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
            clip-rule="evenodd" 
          />
        </svg>
        <p class="text-sm">{{ toastMessage }}</p>
      </div>
    </div>

    <div class="w-full max-w-[95%] md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <div class="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 border border-gray-700">
        <div>
          <h2 class="text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Your Time Capsules
          </h2>
          <p class="text-center text-sm lg:text-base text-gray-400 mb-8">
            Messages waiting to be revealed
          </p>
        </div>

        <div class="space-y-4">
          <div v-if="!capsuleStore.capsules.length" class="text-center py-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-16 w-16 mx-auto text-gray-500 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
            <p class="text-gray-400 text-lg">
              No time capsules yet. Create one to get started!
            </p>
          </div>

          <ul v-else class="divide-y divide-gray-700">
            <li 
              v-for="capsule in capsuleStore.capsules" 
              :key="capsule.id"
              class="py-4 first:pt-0 last:pb-0 hover:bg-gray-750/50 rounded-lg transition-colors duration-200 p-4 cursor-pointer"
              @click="handleCapsuleClick(capsule)"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex-1">
                  <p class="text-gray-100 text-lg font-medium break-words">
                    Capsule {{ capsule.id }}
                  </p>
                  <div class="mt-2 flex items-center text-sm text-gray-400">
                    <svg 
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fill-rule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                        clip-rule="evenodd" 
                      />
                    </svg>
                    Opens: {{ formatDate(capsule.scheduledOpeningTime) }}
                  </div>
                </div>
                <div class="flex items-center">
                  <span 
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="new Date(capsule.scheduledOpeningTime) > new Date() 
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-green-900 text-green-200'"
                  >
                    {{ new Date(capsule.scheduledOpeningTime) > new Date() ? 'Waiting' : 'Ready' }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>


  <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
        @click="closeModal"
      >
        <div 
          class="fixed inset-0 overflow-y-auto"
        >
          <div class="flex min-h-full items-center justify-center p-4">
            <Transition
              enter-active-class="ease-out duration-300"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="ease-in duration-200"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div 
                v-if="showModal"
                class="relative bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-700 shadow-xl"
                @click.stop
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-bold text-white">Time Capsule Message</h3>
                  <div class="flex items-center space-x-2">
                    <button 
                      v-if="!isEditing"
                      @click="startEditing"
                      class="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
                    >
                      <svg 
                        class="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button 
                      @click="closeModal"
                      class="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
                    >
                      <svg 
                        class="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          stroke-width="2" 
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div v-if="selectedCapsule" class="space-y-4">
                  <div class="bg-gray-700/50 rounded-lg p-4">
                    <p class="text-gray-300 text-sm mb-2">Created on: {{ formatDate(selectedCapsule.created_at) }}</p>
                    <div v-if="isEditing" class="space-y-4">
                      <textarea
                        v-model="editedMessage"
                        class="w-full min-h-[150px] bg-gray-900 text-white rounded-lg p-3 border border-gray-600 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      ></textarea>
                      <div class="flex justify-end space-x-2">
                        <button
                          @click="cancelEditing"
                          class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          @click="saveChanges"
                          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                    <p v-else class="text-white whitespace-pre-wrap">{{ selectedCapsule.message }}</p>
                  </div>
                  
                  <div v-if="selectedCapsule.recipient_email" class="bg-gray-700/50 rounded-lg p-4">
                    <p class="text-gray-300 text-sm">Recipient: {{ selectedCapsule.recipient_email }}</p>
                  </div>
                  
                  <div class="bg-gray-700/50 rounded-lg p-4">
                    <p class="text-gray-300 text-sm">Scheduled to open: {{ formatDate(selectedCapsule.scheduledOpeningTime) }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
</template>