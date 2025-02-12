<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api, csrfApi } from '@/axios';
import { useAuthStore } from '@/stores/auth';


const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();


const submitForm = async () => {
  try {
    error.value = '';
    await csrfApi.get('/sanctum/csrf-cookie');
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });
    authStore.setUser(response.data.user);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.';
    console.error('Login failed:', err.response?.data || err.message);
  }
};
</script>

<template>
  <div class="min-h-screen w-full bg-[#242424] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <h2 class="text-center text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8">
          Login
        </h2>

        <form @submit.prevent="submitForm" class="space-y-6">

          <div 
            v-if="error"
            class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg"
          >
            {{ error }}
          </div>


          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              v-model="email"
              required
              class="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              v-model="password"
              required
              class="w-full bg-gray-900 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your password"
            />
          </div>


          <button
            type="submit"
            class="w-full bg-indigo-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>