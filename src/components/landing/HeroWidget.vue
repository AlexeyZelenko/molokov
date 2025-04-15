<script setup lang="ts">
// import HomeSearch from '@/components/forms/BlockSearchHomePage.vue';
</script>

<template>
    <div id="hero" class="flex flex-col">
        <div class="hero-container flex flex-col items-center justify-center text-center">
            <h1 class="text-6xl font-bold leading-tight">
                <span class="font-light block text-white mb-4">Сучасний інструмент для рієлторів!</span>
                <span class="font-light block text-white mb-4">Легко знаходьте та керуйте об'єктами!</span>
            </h1>
            <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-50">Ефективний пошук, управління та угоди в одному місці...</p>
        </div>
    </div>
    <!--    <div class="hero-search-container flex justify-center mt-8">-->
    <!--        <HomeSearch />-->
    <!--    </div>-->
</template>

<style scoped lang="scss">
$font-size-desktop: 36px;
$font-size-mobile: 24px;

#hero {
    .text-6xl {
        font-size: $font-size-desktop;
    }

    .text-2xl {
        font-size: 20px;
    }
}
</style>
