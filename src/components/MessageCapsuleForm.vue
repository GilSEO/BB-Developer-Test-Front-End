<script setup>
import { ref } from 'vue';
import { useMessageCapsuleStore } from '@/stores/messageCapsules';
import { csrfApi } from '@/axios';

const message = ref('');
const scheduledOpeningTime = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const capsuleStore = useMessageCapsuleStore();

const submitForm = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await csrfApi.get('/sanctum/csrf-cookie');

    await capsuleStore.createCapsule({
      message: message.value,
      scheduledOpeningTime: scheduledOpeningTime.value,
    });

    message.value = '';
    scheduledOpeningTime.value = '';
    successMessage.value = 'Message capsule created successfully!';
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'An error occurred while creating the capsule';
    console.error("Error creating capsule:", error.response?.data || error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen w-full bg-[#242424] flex items-center justify-center p-8">
    <div class="w-full max-w-2xl bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
      <h2 class="text-2xl font-bold text-white text-center mb-8">
        Create a New Message Capsule
      </h2>
      
      <form @submit.prevent="submitForm" class="space-y-6">
        <div v-if="successMessage" class="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-400">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-400">
          {{ errorMessage }}
        </div>

        <div class="space-y-2">
          <label for="message" class="block text-sm font-medium text-gray-200">
            Message
          </label>
          <textarea 
            id="message" 
            v-model="message" 
            required
            rows="4"
            placeholder="Enter your message here..."
            :disabled="isLoading"
            class="w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-800 disabled:text-gray-500"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label for="schedule" class="block text-sm font-medium text-gray-200">
            Scheduled Opening Time
          </label>
          <input 
            id="schedule" 
            type="datetime-local" 
            v-model="scheduledOpeningTime" 
            required
            :disabled="isLoading"
            class="w-full rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-800 disabled:text-gray-500"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">Creating...</span>
          <span v-else>Create Capsule</span>
        </button>
      </form>
    </div>
  </div>
</template>