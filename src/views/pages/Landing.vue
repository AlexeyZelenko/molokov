<script setup lang="ts">
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import HeroWidget from '@/components/landing/HeroWidget.vue';
import HighlightsWidget from '@/components/landing/HighlightsWidget.vue';
import HighlightsWidget2 from '@/components/landing/HighlightsWidget2.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import AppFooter from '@/layout/AppFooter.vue';
</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-900">
        <div id="home" class="overflow-hidden relative">
            <section class="home--hero flex flex-col items-center justify-center">
                <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
                    <TopbarWidget />
                </div>
                <HeroWidget />
            </section>
            <section style="max-width: 1500px; margin: 0 auto" class="flex flex-col items-center justify-center">
                <FeaturesWidget />
                <HighlightsWidget />
                <HighlightsWidget2 />
            </section>
            <app-footer></app-footer>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home--hero {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url(https://demo01.houzez.co/wp-content/uploads/2016/03/miami-beach.jpg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(0, 38, 66, 0.5);
    background-blend-mode: overlay;
}
</style>
