import { createApp, nextTick } from 'vue';
import App from './App.vue';
import router from './router';
import { useBreadcrumbStore } from '@/store/breadcrumb';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

// UI и темы
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Стили
import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import 'animate.css';

// Конфигурация темы
const themeConfig = {
    preset: Aura,
    options: {
        darkModeSelector: '.app-dark'
    }
};

async function initializeApp() {
    const app = createApp(App);
    const pinia = createPinia();
    const head = createHead();

    // Обработчик ошибок
    app.config.errorHandler = (err, instance, info) => {
        console.error('Vue Error:', err);
        console.log('Component:', instance);
        console.log('Error Info:', info);
    };

    // Включение режима разработки
    if (process.env.NODE_ENV === 'development') {
        app.config.performance = true;
        app.config.devtools = true;
    }

    // Регистрация плагинов
    app.use(pinia);
    app.use(router);
    app.use(head);
    app.use(PrimeVue, { theme: themeConfig });
    app.use(ToastService);
    app.use(ConfirmationService);

    try {
        // Дожидаемся готовности роутера
        await router.isReady();

        // Настройка навигации и хлебных крошек
        router.afterEach((to) => {
            const breadcrumbStore = useBreadcrumbStore();
            nextTick(() => {
                breadcrumbStore.setBreadcrumb(to.meta.breadcrumb || []);
            });
        });

        // Глобальный обработчик ошибок навигации
        router.onError((error) => {
            console.error('Router error:', error);
        });

        // Монтирование приложения
        app.mount('#app');

        console.log(`App initialized in ${process.env.NODE_ENV} mode`);
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// Запуск приложения
initializeApp().catch(error => {
    console.error('Critical initialization error:', error);
});
