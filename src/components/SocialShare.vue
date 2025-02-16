<!-- SocialShareSpeedDial.vue -->
<template>
    <SpeedDial
        :model="shareItems"
        buttonClassName="p-button-outlined p-button-secondary"
        :hideOnClickOutside="true"
        direction="down-right"
        show-icon="pi pi-share-alt"
    />
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import SpeedDial from 'primevue/speeddial';


const props = defineProps({
    adUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
});

const toast = useToast();

// Функция для показа уведомлений
const showToast = (severity, summary, detail) => {
    toast.add({
        severity,
        summary,
        detail,
        life: 3000
    });
};

// Функция для шаринга в Facebook
const shareToFacebook = () => {
    try {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.adUrl)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
        showToast('error', 'Помилка', 'Не вдалося опублікувати у Facebook');
    }
};

// Функция для шаринга в Telegram
const shareToTelegram = () => {
    try {
        const text = `${props.title}\n\n${props.description}`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(props.adUrl)}&text=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
        showToast('error', 'Помилка', 'Неможливо відправити в Telegram');
    }
};

// Функция для шаринга в Viber
const shareToViber = () => {
    try {
        const text = `${props.title}\n${props.description}`;
        const shareUrl = `viber://forward?text=${encodeURIComponent(text)}\n${encodeURIComponent(props.adUrl)}`;
        window.open(shareUrl, '_blank');
    } catch (error) {
        showToast('error', 'Помилка', 'Неможливо відправити в Viber');
    }
};

// Функция для копирования ссылки
const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(props.adUrl);
        showToast('success', 'Копіювання', 'Посилання скопійоване в буфер обміну');
    } catch (error) {
        showToast('error', 'Помилка', 'Неможливо скопіювати посилання');
    }
};

// Элементы меню SpeedDial
const shareItems = ref([
    {
        label: 'Facebook',
        icon: 'pi pi-facebook',
        command: shareToFacebook
    },
    {
        label: 'Telegram',
        icon: 'pi pi-telegram',
        command: shareToTelegram
    },
    {
        label: 'Viber',
        icon: 'pi pi-whatsapp',
        command: shareToViber
    },
    {
        label: 'Копировать ссылку',
        icon: 'pi pi-copy',
        command: copyLink
    }
]);
</script>

<style>
.p-speeddial-button.p-button.p-button-icon-only {
    width: 3rem;
    height: 3rem;
}

.p-speeddial-action {
    width: 2.5rem;
    height: 2.5rem;
}

.p-speeddial-mask {
    background: rgba(0, 0, 0, 0.1);
}

.p-button-sm .p-button-icon {
    font-size: 24px;
}
</style>
