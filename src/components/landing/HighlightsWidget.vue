<template>
    <div id="highlights" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
        <div class="text-center">
            <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Потужний всюди</div>
            <span class="text-muted-color text-2xl">Amet consectetur adipiscing elit...</span>
        </div>

        <div class="grid grid-cols-12 gap-4 mt-20 pb-2 md:pb-20">
            <div class="flex justify-center col-span-12 lg:col-span-6 bg-purple-100 p-0 order-1 lg:order-none" style="border-radius: 8px">
<!--                <img src="/demo/images/landing/mockup.webp" class="w-11/12" alt="mockup mobile" />-->
                <Galleria :value="customImagesMobile" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true"
                          :showItemNavigators="true" :showThumbnails="false">
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block;" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" />
                    </template>
                    <template #caption="slotProps">
                        <div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
                        <p class="text-white">{{ slotProps.item.alt }}</p>
                    </template>
                </Galleria>
            </div>

            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col lg:items-end text-center lg:text-right gap-4">
                <div class="flex items-center justify-center bg-purple-200 self-center lg:self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                    <i class="pi pi-fw pi-mobile !text-4xl text-purple-700"></i>
                </div>
                <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Зручна мобільна версія</div>
                <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal ml-0 md:ml-2">
                    Керуйте своєю нерухомістю будь-де та будь-коли! Переглядайте доступні об'єкти, зберігайте улюблені пропозиції та швидко зв’язуйтесь із власниками або агентами прямо зі свого смартфона.
                </span>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4 my-20 pt-2 md:pt-20">
            <div class="col-span-12 lg:col-span-6 my-auto flex flex-col text-center lg:text-left lg:items-start gap-4">
                <div class="flex items-center justify-center bg-yellow-200 self-center lg:self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                    <i class="pi pi-fw pi-desktop !text-3xl text-yellow-700"></i>
                </div>
                <div class="leading-none text-surface-900 dark:text-surface-0 text-3xl font-normal">Інтуїтивна аналітика та управління</div>
                <span class="text-surface-700 dark:text-surface-100 text-2xl leading-normal mr-0 md:mr-2">
                    Отримуйте детальну статистику щодо ринку нерухомості, відстежуйте ціни, оцінюйте динаміку попиту та управляйте своїми об’єктами легко та зручно через нашу онлайн-платформу.
                </span>
            </div>

            <div class="flex justify-end order-1 sm:order-2 col-span-12 lg:col-span-6 bg-yellow-100 p-0" style="border-radius: 8px">
<!--                <img src="/demo/images/landing/mockup_desktop.webp" class="w-11/12" alt="mockup" />-->
                <Galleria :value="customImages" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true"
                          :showItemNavigators="true" :showThumbnails="false">
                    <template #item="slotProps">
                        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block;" />
                    </template>
                    <template #thumbnail="slotProps">
                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" />
                    </template>
                    <template #caption="slotProps">
                        <div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
                        <p class="text-white">{{ slotProps.item.alt }}</p>
                    </template>
                </Galleria>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { PhotoService } from '@/service/PhotoService';

onMounted(() => {
    PhotoService.getImages().then((data) => (images.value = data));
});

const images = ref();
const customImages = ref([
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup_desktop.webp',
        alt: 'Отримуйте детальну статистику щодо ринку нерухомості',
        "title": "АНАЛІТИКА"
    },
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop2.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup_desktop2.webp',
        alt: 'Отримуйте детальну статистику',
        title: "АНАЛІТИКА"
    },
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop3.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup_desktop3.webp',
        alt: 'Керуйте клієнтами',
        title: "КЛІЄНТИ"
    },
    {
        itemImageSrc: '/demo/images/landing/mockup_desktop4.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup_desktop4.webp',
        alt: 'Створюйте зручні списки для клієнтів',
        title: "КЛІЄНТИ"
    },
]);


const customImagesMobile = ref([
    {
        itemImageSrc: '/demo/images/landing/mockup.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup.webp',
        alt: 'Отримуйте детальну статистику щодо ринку нерухомості',
        "title": "АНАЛІТИКА"
    },
    {
        itemImageSrc: '/demo/images/landing/mockup2.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup2.webp',
        alt: 'Отримуйте потрібні фільтри',
        title: "ФІЛЬТРИ"
    },
    {
        itemImageSrc: '/demo/images/landing/mockup3.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup3.webp',
        alt: 'Меню для зручного вибору',
        title: "ЗРУЧНЕ МЕНЮ"
    },
    {
        itemImageSrc: '/demo/images/landing/mockup4.webp',
        thumbnailImageSrc: '/demo/images/landing/mockup4.webp',
        alt: 'Різні теми інтерфейсу для вас',
        title: "ТЕМИ"
    },
]);

const responsiveOptions = ref([
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
]);
</script>

<style>
#highlights {
    .p-galleria-next-button, .p-galleria-prev-button {
        color: black;
    }
}
</style>
