import { useAuthStore } from '@/store/auth';

export const authGuard = (to, from, next) => {
    const authStore = useAuthStore();

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
        if (authStore.isAuthenticated) {
            // Check user roles/permissions
            if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
                next('/auth/access');
                return;
            }
            next();
        } else {
            next('/auth/login');
        }
    } else {
        next();
    }
};
