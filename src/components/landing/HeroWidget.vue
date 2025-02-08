<template>
    <div
        id="hero"
        class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
        :style="{
            background: isDarkTheme
                ? 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(45, 45, 45, 0.6) 40%, rgba(100, 100, 100, 0.3) 100%), radial-gradient(100% 200% at 80% 20%, rgba(200, 150, 250, 0.4) 0%, rgba(100, 200, 255, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(230, 240, 255, 0.6) 40%, rgba(200, 225, 255, 0.3) 100%), radial-gradient(100% 200% at 80% 20%, rgba(250, 210, 250, 0.6) 0%, rgba(100, 180, 255, 0.5) 100%)',
            clipPath: 'ellipse(150% 90% at 93% 10%)'
        }">
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-6xl font-bold leading-tight">
                <span class="font-light block">Сучасний інструмент для рієлторів!</span>
                Легко знаходьте та керуйте об'єктами!
            </h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-400">
                Ефективний пошук, управління та угоди в одному місці...
            </p>
        </div>
        <div class="img flex justify-center md:justify-end">
            <img
                src="/demo/images/landing/screen-5.png"
                alt="Hero Image"
                class="w-9/12 md:w-auto"
            />
        </div>
    </div>
</template>

<script setup>
import {useLayout} from "@/layout/composables/layout";

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<style scoped lang="scss">
// Определяем переменные для шрифта
$font-size-desktop: 36px; // Шрифт для десктопа
$font-size-mobile: 24px;  // Шрифт для мобильных устройств

#hero {
    .text-6xl {
        font-size: $font-size-desktop;
    }

    .text-2xl {
        font-size: 20px;
    }

    .img {
        margin-top: -190px;
    }

    @media (max-width: 1200px) {
        .img {
            margin-top: -70px;
        }
    }

    @media (max-width: 768px) {
        .text-6xl {
            font-size: $font-size-mobile; // Под мобильные устройства
        }

        .text-2xl {
            font-size: 18px;
        }

        .img {
            margin-top: -10px;
        }
    }
}

</style>
