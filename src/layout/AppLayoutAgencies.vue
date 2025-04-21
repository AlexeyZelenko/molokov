<script setup>
import Breadcrumb from "@/components/Breadcrumb.vue";
</script>

<template>
    <!-- Header/Navigation -->
    <div class="bg-blue-500 text-white shadow-md">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <router-link to="/" class="text-2xl font-bold hover:text-blue-200">
                <i class="pi pi-home mr-2"></i>
            </router-link>
            <div class="space-x-4">
                <router-link to="/" class="hover:text-blue-200">Головна</router-link>
                <router-link to="/agencies" class="hover:text-blue-200">Агенції</router-link>
                <router-link to="/agents" class="hover:text-blue-200">Агенти</router-link>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 bg-gray-100 min-h-screen max-width[980px]">
        <Breadcrumb />
        <router-view></router-view>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-12">
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 class="text-lg font-semibold mb-4">Про нас</h4>
                    <p class="text-gray-300">Сайт створений для надання професійних послуги з нерухомості з акцентом на задоволення потреб клієнтів та експертність на ринку.</p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Швидкі посилання</h4>
                    <ul class="flex flex-col gap-2 space-y-2 text-gray-300">
                        <router-link to="/"><span class="hover:text-blue-300">Головна</span></router-link>
                        <router-link to="/agencies"><span class="hover:text-blue-300">Агенції</span></router-link>
                        <router-link to="/agents"><span class="hover:text-blue-300">Агенти</span></router-link>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Контакти</h4>
                    <div class="space-y-2 text-gray-300">
                        <a href="https://t.me/+OxRsC4L7d8lmZDcy" target="_blank"
                           class="flex items-center gap-2 text-gray-300 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                            <i class="pi pi-telegram text-primary-500 dark:text-primary-400"></i>
                            <span>Технічна підтримка</span>
                        </a>
                        <a href="mailto:infinitydevelopinfinity@gmail.com"
                           class="flex items-center gap-2 text- dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                            <i class="pi pi-envelope text-primary-500 dark:text-primary-400"></i>
                            <span>infinitydevelopinfinity@gmail.com</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 RealEstate Pro. Всі права захищено.</p>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>
