import { createApp, nextTick } from 'vue';
import App from './App.vue';
import router from './router';
import { useBreadcrumbStore } from '@/store/breadcrumb';
import { createPinia } from 'pinia';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import 'animate.css';

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');

router.afterEach((to) => {
    const breadcrumbStore = useBreadcrumbStore();

    nextTick(() => {
        breadcrumbStore.setBreadcrumb(to.meta.breadcrumb || []);
    });
});
