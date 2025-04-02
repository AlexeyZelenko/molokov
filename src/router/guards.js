import { useAuthStore } from '@/store/authFirebase';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export const loading = ref(false);

const MIN_LOADING_TIME = 1000;
let loadingStartTime = 0;

export const authGuard = async (to, from, next) => {
    loadingStartTime = Date.now();
    loading.value = true;
    const authStore = useAuthStore();
    const toast = useToast();

    try {
        const currentUser = await authStore.getCurrentUser();

        const isAuthRequired = to.meta?.requiresAuth || to.requiresAuth;
        const isUserAuthenticated = authStore.user;

        if (currentUser && authStore.userRole === 'blocked' && to.path !== '/auth/access' && isAuthRequired) {
            finishLoading();
            return next('/auth/access');
        }

        const rememberedUser = localStorage.getItem('userRemembered');
        const storedEmail = localStorage.getItem('userEmail');

        if (rememberedUser && storedEmail) {
            await new Promise((resolve, reject) => {
                onAuthStateChanged(
                    auth,
                    (user) => {
                        if (user) {
                            authStore.user = {
                                ...authStore.user,
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
        }

        if (isAuthRequired && !isUserAuthenticated) {
            finishLoading();
            return next('/auth/login');
        }

        if (to.meta?.requiresAdmin && authStore.userRole !== 'admin') {
            finishLoading();
            return next('/');
        }

        finishLoading();
        next();
    } catch (error) {
        console.error('Error in authGuard:', error);
        localStorage.removeItem('userRemembered');
        localStorage.removeItem('userEmail');
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Помилка відновлення сесії.',
            life: 3000
        });
        finishLoading();
        next(false);
    }
};

function finishLoading() {
    const elapsed = Date.now() - loadingStartTime;
    const delay = Math.max(0, MIN_LOADING_TIME - elapsed);

    setTimeout(() => {
        loading.value = false;
    }, delay);
}

export function setupRouterGuards(router) {
    router.onError((error) => {
        console.error('Navigation error:', error);
        loading.value = false;
    });
}
