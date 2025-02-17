<template>
    <section class="highlights py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
        <!-- Заголовок секции -->
        <header class="text-center">
            <h2 class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Потужний всюди</h2>
            <p class="text-muted-color text-2xl">Зручний доступ до ринку нерухомості з будь-якого пристрою – завжди і всюди.</p>
        </header>

        <!-- Мобильная секция -->
        <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
            <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-none rounded-lg">
                <CustomGalleria
                    :images="mobileGalleryImages"
                    :options="galleryOptions"
                    class="w-11/12"
                />
            </div>

            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                <div class="flex items-center justify-center bg-purple-200 self-center lg:self-end w-[4.2rem] h-[4.2rem] rounded-[10px]">
                    <i class="pi pi-fw pi-mobile !text-4xl text-purple-700"></i>
                </div>
                <h3 class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Зручна мобільна версія</h3>
                <p class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2">
                    Керуйте своєю нерухомістю будь-де та будь-коли! Переглядайте доступні об'єкти, зберігайте улюблені пропозиції та швидко зв'язуйтесь із власниками або агентами прямо зі свого смартфона.
                </p>
            </div>
        </div>

        <!-- Десктопная секция -->
        <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start w-[4.2rem] h-[4.2rem] rounded-[10px]">
                    <i class="pi pi-fw pi-desktop !text-3xl text-yellow-700"></i>
                </div>
                <h3 class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Інтуїтивна аналітика та управління</h3>
                <p class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2">
                    Отримуйте детальну статистику щодо ринку нерухомості, відстежуйте ціни, оцінюйте динаміку попиту та управляйте своїми об'єктами легко та зручно через нашу онлайн-платформу.
                </p>
            </div>

            <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0 rounded-lg">
                <CustomGalleria
                    :images="desktopGalleryImages"
                    :options="galleryOptions"
                    class="w-full"
                />
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import CustomGalleria from './CustomGalleria.vue';

// Конфигурация галереи
const galleryOptions = computed(() => ({
    numVisible: 5,
    circular: true,
    showItemNavigators: true,
    showThumbnails: false,
    responsiveOptions: [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ]
}));

// Данные для мобильной галереи
const mobileGalleryImages = ref([
    {
        itemImageSrc: '/demo/images/landing/mockup.webp',
        alt: 'Отримуйте детальну статистику щодо ринку нерухомості',
        title: 'АНАЛІТИКА'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup2.webp',
        alt: 'Отримуйте потрібні фільтри',
        title: 'ФІЛЬТРИ'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup3.webp',
        alt: 'Меню для зручного вибору',
        title: 'ЗРУЧНЕ МЕНЮ'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup4.webp',
        alt: 'Різні теми інтерфейсу для вас',
        title: 'ТЕМИ'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup5.webp',
        alt: 'Фільтри, які вам потрібні',
        title: 'КАРТИ'
    }
]);

// Данные для десктопной галереи
const desktopGalleryImages = ref([
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop.webp',
        alt: 'Отримуйте детальну статистику щодо ринку нерухомості',
        title: 'АНАЛІТИКА'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop2.webp',
        alt: 'Отримуйте детальну статистику',
        title: 'АНАЛІТИКА'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop3.webp',
        alt: 'Керуйте клієнтами',
        title: 'КЛІЄНТИ'
    },
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop4.webp',
        alt: 'Створюйте зручні списки для клієнтів',
        title: 'КЛІЄНТИ'
    }
]);
</script>

<style scoped>
.highlights :deep(.p-galleria-next-button),
.highlights :deep(.p-galleria-prev-button) {
    color: black;
}
</style>
