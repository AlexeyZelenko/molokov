<template>
    <div
        id="hero"
        class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-6 md:mx-20 mt-0 md:mt-6">
            <h1 class="text-6xl font-bold text-gray-900 leading-tight">
                <span class="font-light block">Сучасний інструмент для рієлторів!</span>
                Легко знаходьте та керуйте об'єктами!
            </h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700">
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
