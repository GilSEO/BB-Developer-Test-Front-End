import { defineStore } from 'pinia';
import { api } from '@/axios';

export const useMessageCapsuleStore = defineStore('messageCapsules', {
    state: () => ({
        capsules: [],
    }),
    actions: {
        async fetchCapsules() {
            try {
                const response = await api.get('/message-capsules');
                this.capsules = response.data;
            } catch (error) {
                console.error("Error fetching capsules:", error);
            }
        },
        async createCapsule(data) {
            try {
                const response = await api.post('/message-capsules', data);
                this.capsules.push(response.data);
            } catch (error) {
                console.error("Error creating capsule:", error);
                throw error;
            }
        },
    },
});
