<script setup>
import { computed,  onMounted } from "vue";
import { useRouter } from "vue-router";
import { api, csrfApi } from "./axios";
import { useMessageCapsuleStore } from '@/stores/messageCapsules';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const capsuleStore = useMessageCapsuleStore();

const getUser = async () => {
  try {
    const response = await api.get('http://127.0.0.1:8000/api/user', { withCredentials: true });
    user.value = response.data;
  } catch (error) {
    user.value = null;
  }
};



const logout = async () => {
  try {
    await csrfApi.get('/sanctum/csrf-cookie');
    await api.post('/logout', {}, { withCredentials: true });
    await authStore.logout();
    capsuleStore.$reset();
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const getCapsules = async () => {
  if (!state.token) return;
  try {
    const response = await api.get("/message-capsules", {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    state.capsules = response.data;
  } catch (error) {
    console.error("Error getting capsules:", error);
  }
};

const createCapsule = async (data) => {
  try {
    const response = await api.post("/message-capsules", data, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    state.capsules.push(response.data);
    router.push('/');
  } catch (error) {
    console.error("Error creating capsule:", error);
  }
};




onMounted(getUser);

</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">View Capsules</router-link> |
      <router-link to="/create" v-if="user">Create Capsule</router-link> |
      <router-link to="/login" v-if="!user">Login</router-link>
      <router-link to="/register" v-if="!user">Register</router-link>
      <button v-if="user" @click="logout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<style>
/* Add some basic styles */
nav {
  padding: 1rem;
  background-color: #f5f5f5;
}
nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}
</style>