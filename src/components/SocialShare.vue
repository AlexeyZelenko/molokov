<template>
    <div class="social-share-container">
        <div v-if="isOpen" class="speeddial-mask" @click="closeSpeedDial"></div>

        <SpeedDial
            :model="shareItems"
            buttonClassName="p-button-outlined p-button-secondary share-button"
            :hideOnClickOutside="true"
            direction="left"
            show-icon="pi pi-share-alt"
            hide-icon="pi pi-times"
            @show="handleShow"
            @hide="handleHide"
            :mask="false"
        />

        <Transition v-if="showPreview" name="fade">
            <div class="share-preview-card">
                <div v-if="shareMetaData.image" class="preview-image">
                    <img :src="shareMetaData.image" :alt="shareMetaData.title" />
                </div>
                <div class="preview-content">
                    <h3 class="preview-title">{{ shareMetaData.title }}</h3>
                    <p class="preview-description">{{ shareMetaData.description }}</p>
                    <div class="preview-url">{{ shareMetaData.formattedUrl }}</div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
import SpeedDial from 'primevue/speeddial';
import { useHead } from '@vueuse/head'

const telegram = inject('telegram');

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

const shareProductTelegramWebApp = () => {
    console.log('Share product');
    const property = props.property;

    const descriptionParts = [
        `Подивіться на цей об'єкт: ${props.property.title} - ${props.property.price} $`,
        `🏠 Кімнат: ${property.rooms?.all || 'Не вказано'} 💰 Ціна: ${property.price} USD`,
        `📏 Площа: ${property.apartmentArea?.totalArea} м²  🔝 Поверх: ${property.floors.floor}/${property.floors.totalFloors}`,
        `🏙️ Адреса: ${property.address.region.name} / ${property.address.city.name || ''} / ${property.address.area.name || ''}/n`,
    ].filter(Boolean).join('\n');

    const text = descriptionParts;
    const url = props.adUrl;

    // Используем Telegram WebApp API для шаринга, если доступно
    telegram.shareContent(text, url);
}

// Добавляем состояние для отслеживания открытия/закрытия SpeedDial
const isOpen = ref(false);

const handleShow = () => {
    isOpen.value = true;
};

const handleHide = () => {
    isOpen.value = false;
};

const closeSpeedDial = () => {
    isOpen.value = false;
};

// Остальной код остается без изменений
const formatUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return `${urlObj.hostname}${urlObj.pathname.slice(0, 15)}${urlObj.pathname.length > 15 ? '...' : ''}`;
    } catch {
        return url.slice(0, 30) + (url.length > 30 ? '...' : '');
    }
};

const shareMetaData = computed(() => {
    const { property, title, adUrl, imageUrl  } = props;
    const urlFindProperty = `/${property.category.code}/${property.subcategory.code}/${property.idProperty}`;
    const newUrl = new URL(urlFindProperty, window.location.origin).href;

    const descriptionParts = [
        `🏠 Кімнат: ${property.rooms?.all || 'Не вказано'} 💰 Ціна: ${property.price} USD`,
        `📏 Площа: ${property.apartmentArea?.totalArea} м²  🔝 Поверх: ${property.floors.floor}/${property.floors.totalFloors}`,
        `🏙️ Адреса: ${property.address.region.name} / ${property.address.city.name || ''} / ${property.address.area.name || ''}/n`,
    ].filter(Boolean).join('\n');

    let imageFullUrl = '';
    if (imageUrl) {
        // Используем переданный URL изображения, если он есть
        imageFullUrl = imageUrl;
    } else if (property.images && property.images.length > 0) {
        imageFullUrl = property.images[0];
    }

    // Преобразуем в абсолютный URL, если URL относительный
    if (imageFullUrl && !imageFullUrl.startsWith('http')) {
        const baseUrl = window.location.origin;
        imageFullUrl = new URL(imageFullUrl, baseUrl).href;
    }

    const descriptionPartsTelegram = [
        `${property.category.name}/${property.subcategory.name}`,
        `🏠 Кімнат: ${property.rooms?.all || 'Не вказано'} 💰 Ціна: ${property.price} USD`,
        `📏 Площа: ${property.apartmentArea?.totalArea} м²  🔝 Поверх: ${property.floors.floor}/${property.floors.totalFloors}`,
        `🏙️ Адреса: ${property.address.region.name} / ${property.address.city.name || ''} / ${property.address.area.name || ''}`,
    ].filter(Boolean).join('\n');

    return {
        title,
        description: descriptionParts,
        image: imageFullUrl,
        url: newUrl || adUrl,
        formattedUrl: formatUrl(adUrl),
        descriptionPartsTelegram
    };
});

const SHARE_CONFIG = {
    facebook: {
        buildUrl: (data) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
        icon: 'pi pi-facebook',
        label: 'Facebook'
    },
    telegram: {
        buildUrl: (data) => {
            // Добавляем URL в конец сообщения отдельной строкой
            // Telegram автоматически делает URL кликабельным, если он в отдельной строке
            // const textWithUrl = `${data.description}\n\n${data.url}`;

            const textWithUrl = `\n${data.descriptionPartsTelegram}`;

            return `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(textWithUrl)}&parse_mode=html`;
        },
        icon: 'pi pi-telegram',
        label: 'Telegram'
    },
    viber: {
        buildUrl: (data) =>
            `viber://forward?text=${encodeURIComponent(`${data.url}${data.description}`)}`,
        icon: 'pi pi-phone',
        label: 'Viber'
    },
    whatsapp: {
        buildUrl: (data) =>
            `https://api.whatsapp.com/send?text=${encodeURIComponent(`${data.description}\n\n${data.url}`)}`,
        icon: 'pi pi-whatsapp',
        label: 'WhatsApp'
    }
};

const toast = useToast();
const showPreview = ref(false);

const shareContent = (platform) => {
    try {
        const config = SHARE_CONFIG[platform];
        if (!config) throw new Error(`Unsupported platform: ${platform}`);

        // Получаем URL для шеринга
        const url = config.buildUrl(shareMetaData.value);

        // Открываем окно шеринга
        window.open(url, '_blank', 'width=600,height=400');
    } catch (error) {
        showToast('error', 'Помилка', `Неможливо поділитися через ${platform}`);
        console.error(`Share error (${platform}):`, error);
    }
};

const showToast = (severity, summary, detail) => {
    toast.add({
        severity,
        summary,
        detail,
        life: 3000
    });
};

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(props.adUrl);
        showToast('success', 'Копіювання', 'Посилання скопійоване в буфер обміну');
    } catch (error) {
        showToast('error', 'Помилка', 'Неможливо скопіювати посилання');
    }
};

const shareItems = computed(() => [
    ...Object.entries(SHARE_CONFIG).map(([platform, config]) => ({
        label: config.label,
        icon: config.icon,
        command: () => shareContent(platform)
    })),
    {
        label: 'Копіювати посилання',
        icon: 'pi pi-copy',
        command: copyLink
    }
]);

onMounted(() => {
    console.log('Share mounted', props.property);
    useHead({
        title: shareMetaData.value.title,
        meta: [
            { name: 'description', content: shareMetaData.value.description },
            { property: 'og:title', content: shareMetaData.value.title },
            { property: 'og:description', content: shareMetaData.value.description },
            { property: 'og:image', content: shareMetaData.value.image },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:url', content: shareMetaData.value.url },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: shareMetaData.value.title },
            { name: 'twitter:description', content: shareMetaData.value.description },
            { name: 'twitter:image', content: shareMetaData.value.image }
        ]
    });

    if (telegram.isAvailable) {
        // Настраиваем навигацию
        telegram.enableBackButton(true);
        telegram.onBackButtonClicked(() => {
            router.go(-1);
        });

        // Деактивируем главную кнопку (мы используем собственную кнопку в форме)
        telegram.enableMainButton(false);
    }
});

onBeforeUnmount(() => {
    if (telegram.isAvailable) {
        telegram.enableBackButton(false);
    }
});
</script>

<style scoped>
.social-share-container {
    position: absolute;
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
    z-index: 998;
}

.share-button.p-button.p-button-icon-only {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    z-index: 999;
}

:deep(.p-speeddial) {
    z-index: 999;
}

:deep(.p-speeddial-list) {
    z-index: 999;
}

.share-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.p-speeddial-action {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: transform 0.2s ease;
}

.p-speeddial-action:hover {
    transform: scale(1.1);
}

.share-preview-card {
    position: absolute;
    top: 100%;
    right: 0;
    width: 300px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
    z-index: 999;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
}

.social-share-container:hover .share-preview-card {
    opacity: 1;
    transform: translateY(0);
}

.preview-image {
    width: 100%;
    height: 150px;
    overflow: hidden;
}

.preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-content {
    padding: 15px;
}

.preview-title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.preview-description {
    margin: 0 0 10px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
}

.preview-url {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
</style>
