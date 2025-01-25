import { useAuthStore } from '@/store/authFirebase';
import { auth } from '@/firebase/config'
import {
    onAuthStateChanged,
} from 'firebase/auth'

export const authGuard = async (to, from, next) => {
    const authStore = useAuthStore();

    // Check for persisted login
    const rememberedUser = localStorage.getItem('userRemembered');
    const storedEmail = localStorage.getItem('userEmail');

    // If not authenticated but user wants to be remembered
    if (rememberedUser && storedEmail) {
        try {
            // Verify current authentication state
            await new Promise((resolve, reject) => {
                onAuthStateChanged(
                    auth,
                    (user) => {
                        if (user) {
                            authStore.user = {
                                uid: user.uid,
                                email: user.email,
                                displayName: user.displayName
                            };
                            resolve(user);
                        } else {
                            reject();
                        }
                    },
                    reject
                );
            });
        } catch (error) {
            // Clear remembered user if authentication fails
            localStorage.removeItem('userRemembered');
            localStorage.removeItem('userEmail');
        }
    }

    // Standard authentication check
    if (to.meta.requiresAuth && !authStore.user) {
        next('/auth/login');
    } else {
        next();
    }
};
