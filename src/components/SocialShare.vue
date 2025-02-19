<template>
    <div class="social-share-container">
        <SpeedDial
            :model="shareItems"
            buttonClassName="p-button-outlined p-button-secondary share-button"
            :hideOnClickOutside="true"
            direction="down-right"
            show-icon="pi pi-share-alt"
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
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import SpeedDial from 'primevue/speeddial';
import { useHead } from '@vueuse/head'

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

// Format URL helper function
const formatUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return `${urlObj.hostname}${urlObj.pathname.slice(0, 15)}${urlObj.pathname.length > 15 ? '...' : ''}`;
    } catch {
        return url.slice(0, 30) + (url.length > 30 ? '...' : '');
    }
};

// Move shareMetaData computed property before useHead
const shareMetaData = computed(() => {
    const { property, title, adUrl } = props;
    const description = `Ціна: ${property.price} грн
     - Кімнат: ${property.rooms.all}`;
    const image = property.images?.[0] || '';

    return {
        title,
        description,
        image,
        url: adUrl,
        formattedUrl: formatUrl(adUrl)
    };
});

// Now useHead can safely access shareMetaData
onMounted(() => {
    useHead({
        title: shareMetaData.value.title,
        meta: [
            { name: 'description', content: shareMetaData.value.description },
            { property: 'og:title', content: shareMetaData.value.title },
            { property: 'og:description', content: shareMetaData.value.description },
            { property: 'og:image', content: shareMetaData.value.image },
            { property: 'og:url', content: shareMetaData.value.url },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' }
        ]
    });
});

const SHARE_CONFIG = {
    facebook: {
        buildUrl: (data) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.title)}`,
        icon: 'pi pi-facebook',
        label: 'Facebook'
    },
    telegram: {
        buildUrl: (data) => {
            // Используем специальный формат URL для Telegram с поддержкой превью
            const telegramText = `${data.title}\n\n${data.description}`;
            const instantView = data.image ? `&image=${encodeURIComponent(data.image)}` : '';
            return `https://t.me/share/url?url=${encodeURIComponent(data.url)}${instantView}&text=${encodeURIComponent(telegramText)}`;
        },
        icon: 'pi pi-telegram',
        label: 'Telegram'
    },
    viber: {
        buildUrl: (data) =>
            `viber://forward?text=${encodeURIComponent(`${data.title}\n${data.url}`)}`,
        icon: 'pi pi-phone',
        label: 'Viber'
    },
    whatsapp: {
        buildUrl: (data) =>
            `https://api.whatsapp.com/send?text=${encodeURIComponent(`${data.title}\n\n${data.url}`)}`,
        icon: 'pi pi-whatsapp',
        label: 'WhatsApp'
    }
};

const toast = useToast();
const showPreview = ref(true);

const shareContent = (platform) => {
    try {
        const config = SHARE_CONFIG[platform];
        if (!config) throw new Error(`Unsupported platform: ${platform}`);

        const url = config.buildUrl(shareMetaData.value);

        // Специальная обработка для Telegram
        if (platform === 'telegram') {
            // Добавляем небольшую задержку, чтобы meta-теги успели обновиться
            setTimeout(() => {
                window.open(url, '_blank', 'width=600,height=400');
            }, 100);
        } else {
            window.open(url, '_blank', 'width=600,height=400');
        }
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
</script>

<style scoped>
.social-share-container {
    position: relative;
    display: inline-block;
}

.share-button.p-button.p-button-icon-only {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
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

.p-speeddial-mask {
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(2px);
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
    z-index: 2000;
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
</style>
