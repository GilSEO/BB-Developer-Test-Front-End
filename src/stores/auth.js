import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);

    function setUser(newUser) {
        user.value = newUser;
    }

    function logout() {
        user.value = null;
    }

    return { user, setUser, logout };
});