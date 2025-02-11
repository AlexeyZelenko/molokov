import { defineStore } from 'pinia';
import { auth, db } from '@/firebase/config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        loading: false,
        error: null
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
        },
        async resetPassword(email) {
            try {
                await sendPasswordResetEmail(auth, email);
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        }
    }
});
