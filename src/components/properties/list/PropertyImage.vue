<script setup>
import { computed, defineProps, ref, watch } from 'vue';
import Tag from 'primevue/tag';
import Skeleton from 'primevue/skeleton';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    },
    altText: {
        type: String,
        default: 'Зображення нерухомості'
    },
    isPublic: {
        type: Boolean,
        default: undefined
    },
    showStatusTag: {
        type: Boolean,
        default: false
    }
});

const isLoading = ref(false);
const isError = ref(false);

// Обчислюване значення для URL цільової картинки (або null, якщо її немає)
const targetImageUrl = computed(() => props.images?.length ? props.images[0] : null);

// Обчислюване значення для URL картинки, що ВІДОБРАЖАЄТЬСЯ (з урахуванням помилки/плейсхолдера)
const displayImageUrl = computed(() => {
    // Показуємо плейсхолдер, якщо була помилка АБО якщо цільової картинки немає
    if (isError.value || !targetImageUrl.value) {
        return '/images/placeholder-image.webp';
    }
    // В іншому випадку - цільова картинка
    return targetImageUrl.value;
});

// Обчислюване значення для alt тексту
const imageAlt = computed(() => {
    // Використовуємо altText, якщо показуємо цільову картинку, інакше - текст плейсхолдера
    return !isError.value && targetImageUrl.value ? props.altText : 'Немає зображення';
});


// 3. Обробники подій завантаження/помилки картинки
const onImageLoad = () => {
    isLoading.value = false;
    isError.value = false;
};

const onImageError = () => {
    console.error('Не вдалося завантажити картинку:', targetImageUrl.value); // Логуємо помилку
    isLoading.value = false;
    isError.value = true; // Встановлюємо стан помилки
};

// 4. Спостерігаємо за зміною цільового URL, щоб скинути стан завантаження
watch(targetImageUrl, (newUrl) => {
    if (newUrl) {
        // Якщо є новий URL, починаємо завантаження
        isError.value = false;
        isLoading.value = true;
    } else {
        // Якщо цільового URL немає, завантаження не потрібне
        isLoading.value = false;
        isError.value = false;
    }
}, { immediate: true }); // immediate: true - запустити відразу при монтуванні

const getSeverity = (status) => {
    switch (status) {
        case true: return 'success';
        case false: return 'warn';
        default: return null;
    }
};
const tagSeverity = computed(() => getSeverity(props.isPublic));
const tagText = computed(() => {
    return props.isPublic ? 'Опубліковано' : 'Не опубліковано';
});

</script>

<template>
    <div class="md:w-40 relative h-40 shrink-0 bg-surface-100 dark:bg-surface-800 rounded">
        <Skeleton v-if="isLoading" width="100%" height="100%" class="absolute top-0 left-0 rounded" />

        <img
            v-show="!isLoading"
            class="block mx-auto rounded w-full h-full object-cover transition-opacity duration-300 ease-in-out"
            :src="displayImageUrl.url || displayImageUrl"
            :alt="imageAlt"
            @load="onImageLoad"
            @error="onImageError"
            :key="displayImageUrl.url || displayImageUrl"
        />

        <Tag
            v-if="showStatusTag && typeof isPublic === 'boolean'"
            :value="tagText"
            :severity="tagSeverity"
            class="absolute"
            style="left: 5px; top: 5px"
        />
    </div>
</template>

<style scoped>
/* Стилі для плавної появи картинки */
img {
    opacity: 1;
}
/* Стиль для v-show="false" */
img[style*="display: none;"] {
    opacity: 0;
     display: block !important; /* Може знадобитись, щоб події load/error спрацювали
}

.p-skeleton {
    border-radius: inherit; /* Успадковує заокруглення від батька */
    /* Додайте базовий колір скелетону, якщо потрібно */
    /* background-color: rgba(0, 0, 0, 0.1); */
}
</style>
