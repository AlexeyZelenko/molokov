<script setup>
import {ref, inject, onMounted, onBeforeUnmount } from 'vue';
import {useToast} from 'primevue/usetoast';
import {useHead} from '@unhead/vue';
import SocialShareSpeedDial from './SocialShareSpeedDial.vue';
import {useSocialShare} from '@/composables/useSocialShare';
import {useTelegram} from '@/composables/useTelegram';

const telegram = inject('telegram');
const toast = useToast();

const props = defineProps({
    adUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    property: {
        type: Object,
        required: true
    }
});

// Создание URL для шеринга
const createShareUrl = () => {
    return `https://ogshare-ngadaglvca-uc.a.run.app/ogShare?id=${props.property.idProperty}`;
};

// State management
const isOpen = ref(false);

// Event handlers
const handleShow = () => {
    isOpen.value = true;
};

const handleHide = () => {
    isOpen.value = false;
};

const closeSpeedDial = () => {
    isOpen.value = false;
};

// Создаем модифицированные props для useSocialShare
const modifiedProps = {
    ...props,
    adUrl: createShareUrl() // Заменяем URL на URL для шеринга
};

// Use our composables
const {shareMetaData, shareItems, shareProductTelegramWebApp} = useSocialShare(modifiedProps, toast);
const {setupTelegram, cleanupTelegram} = useTelegram(telegram);

// Setup meta tags для логированных пользователей (все равно нужны)
useHead({
    title: shareMetaData.value.title,
    meta: [
        {name: 'description', content: shareMetaData.value.description},
        {property: 'og:title', content: shareMetaData.value.title},
        {property: 'og:description', content: shareMetaData.value.description},
        {property: 'og:image', content: shareMetaData.value.image},
        {property: 'og:url', content: shareMetaData.value.url},
        {property: 'og:type', content: 'website'},
        {property: 'og:site_name', content: 'Нерухомість'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:title', content: shareMetaData.value.title},
        {name: 'twitter:description', content: shareMetaData.value.description},
        {name: 'twitter:image', content: shareMetaData.value.image}
    ]
});

onMounted(() => {
    setupTelegram();
});

onBeforeUnmount(() => {
    cleanupTelegram();
});
</script>

<template>
    <div class="social-share-container">
        <div v-if="isOpen" class="speeddial-mask" @click="closeSpeedDial"></div>

        <SocialShareSpeedDial
            :shareItems="shareItems"
            :isOpen="isOpen"
            @show="handleShow"
            @hide="handleHide"
        />
    </div>
</template>

<style scoped>
.social-share-container {
    position: absolute;
    z-index: 1000;
    right: 10px;
    display: inline-block;
}

.speeddial-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    z-index: 0;
}
</style>
