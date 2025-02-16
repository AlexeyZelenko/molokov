import { useAuthStore } from '@/store/authFirebase';
import { auth } from '@/firebase/config'
import {
    onAuthStateChanged,
} from 'firebase/auth'
import { storeToRefs } from 'pinia'
import { ref } from 'vue';

// Создаем реактивное состояние для лоадера
export const loading = ref(false);

// Время для минимального отображения лоадера
const MIN_LOADING_TIME = 1000;
let loadingStartTime = 0;

export const authGuard = async (to, from, next) => {
    // Запускаем лоадер
    loadingStartTime = Date.now();
    loading.value = true;

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
        } catch (error) {
            // Clear remembered user if authentication fails
            localStorage.removeItem('userRemembered');
            localStorage.removeItem('userEmail');
        }
    }

    if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
        finishLoading();
        next('/');
        return;
    }

    // Standard authentication check
    if (to.meta.requiresAuth && !authStore.user) {
        finishLoading();
        next('/auth/login');
    } else {
        finishLoading();
        next();
    }
};

// Функция для завершения загрузки с минимальной задержкой
function finishLoading() {
    const elapsed = Date.now() - loadingStartTime;
    const delay = Math.max(0, MIN_LOADING_TIME - elapsed);

    setTimeout(() => {
        loading.value = false;
    }, delay);
}

// Функция для настройки других хуков маршрутизации
export function setupRouterGuards(router) {
    // Регистрируем обработчик ошибок
    router.onError((error) => {
        console.error('Navigation error:', error);
        loading.value = false;
    });
}
