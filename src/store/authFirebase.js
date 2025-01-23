import { defineStore } from 'pinia';
import { auth } from '@/firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        error: null,
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => auth.currentUser,
        userRole: (state) => auth.currentUser || 'guest'
    },

    actions: {
        async register(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                this.user = user;
                return user;
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                this.user = user;
                return user;
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await signOut(auth);
                this.user = null;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        }
    }
});
