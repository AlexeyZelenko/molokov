<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showScrollButton = ref(false);

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

const handleScroll = () => {
    showScrollButton.value = window.scrollY > 300;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <footer class="bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700">
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Контактная информация -->
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">Контакти</h3>
                    <div class="space-y-2">
                        <a href="https://t.me/+OxRsC4L7d8lmZDcy" target="_blank" 
                           class="flex items-center gap-2 text-surface-700 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                            <i class="pi pi-telegram text-primary-500 dark:text-primary-400"></i>
                            <span>Технічна підтримка</span>
                        </a>
                        <a href="mailto:infinitydevelopinfinity@gmail.com" 
                           class="flex items-center gap-2 text-surface-700 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                            <i class="pi pi-envelope text-primary-500 dark:text-primary-400"></i>
                            <span>infinitydevelopinfinity@gmail.com</span>
                        </a>
                    </div>
                </div>

                <!-- Информация о приложении -->
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">Про додаток</h3>
                    <p class="text-surface-700 dark:text-surface-300">
                        Це сучасний додаток для пошуку та додавання нерухомості в Україні.
                    </p>
                </div>

                <!-- Быстрые ссылки -->
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">Швидкі посилання</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="#features" class="text-surface-700 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                Вибрати нерухомість
                            </a>
                        </li>
                        <li>
                            <a href="#highlights" class="text-surface-700 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                Про додаток
                            </a>
                        </li>
                        <li>
                            <a href="/cherkasy-areas" class="text-surface-700 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                Райони
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Копирайт -->
            <div class="mt-8 pt-8 border-t border-surface-200 dark:border-surface-700 text-center text-surface-700 dark:text-surface-300">
                <p>&copy; {{ new Date().getFullYear() }} Всі права захищені.</p>
            </div>
        </div>

        <!-- Кнопка скролла вверх -->        
        <button
            v-if="showScrollButton"
            @click="scrollToTop"
            class="fixed bottom-8 right-8 bg-primary-500 dark:bg-primary-400 text-surface-0 w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-primary-600 dark:hover:bg-primary-300 transition-colors duration-200 z-50">
            <i class="pi pi-arrow-up"></i>
        </button>
    </footer>
</template> 