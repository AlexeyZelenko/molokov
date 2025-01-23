import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role || 'guest'
    },
    actions: {
        login(userData) {
            // Authentication logic
            this.user = userData;
            this.token = userData.token;
        },
        logout() {
            this.user = null;
            this.token = null;
        }
    }
});
