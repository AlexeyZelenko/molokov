// import { useAuthStore } from '@/store/auth';
import { useAuthStore } from '@/store/authFirebase';

export const authGuard = (to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/auth/login');
    } else {
        next();
    }

};
