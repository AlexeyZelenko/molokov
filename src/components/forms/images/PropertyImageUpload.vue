<template>
    <div class="field col-12">
        <div class="font-semibold text-xl mb-2">Фотографії</div>
        <UploadArea
            @upload="handleUpload"
            :is-uploading="uploadState.isUploading"
        />
        <div v-if="uploadState.isUploading" class="my-4">
            <ProgressBar :value="uploadState.progress" class="mb-2" />
            <div class="flex justify-between text-sm">
                <span>Завантаження: {{ uploadState.currentFile }}</span>
                <span>{{ uploadState.completedFiles }} з {{ uploadState.totalFiles }}</span>
            </div>
        </div>
        <ImageGrid
            :images="images"
            @remove="handleRemove"
            @reorder="handleReorder"
        />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ProgressBar from 'primevue/progressbar';
import UploadArea from './UploadArea.vue';
import ImageGrid from './ImageGrid.vue';
import { usePropertyDirectImageUpload } from '@/composables/additionManagerProperty/usePropertyDirectImageUpload';
import { useAuthStore } from '@/store/authFirebase';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    },
    property: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['upload', 'remove', 'reorder']);
const toast = useToast();
const authStore = useAuthStore();
const userId = ref(null);

// Используем composable для прямой загрузки в Firebase
const { uploadState, uploadImagesToFirebase, deleteImageFromFirebase } = usePropertyDirectImageUpload();

onMounted(async () => {
    const currentUser = await authStore.getCurrentUser();
    userId.value = currentUser?.uid;
});

const handleUpload = async (files) => {
    if (!userId.value) {
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Користувач не авторизований',
            life: 3000
        });
        return;
    }

    try {
        // Загружаем изображения напрямую в Firebase
        const updatedImages = await uploadImagesToFirebase(
            files,
            userId.value,
            props.property,
            props.images
        );

        // Уведомляем родительский компонент о новых изображениях
        emit('upload', updatedImages);

        if (!uploadState.value.errors.length) {
            toast.add({
                severity: 'success',
                summary: 'Успішно',
                detail: `Завантажено ${files.length} фото`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Увага',
                detail: `Деякі фото не завантажились: ${uploadState.value.errors.length}`,
                life: 3000
            });
        }
    } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося завантажити фотографії',
            life: 3000
        });
    }
};

const handleRemove = async (imageToDelete) => {
    try {
        // Удаляем изображение из Firebase и обновляем список
        const updatedImages = await deleteImageFromFirebase(imageToDelete, props.images);

        // Уведомляем родительский компонент об удалении
        emit('remove', updatedImages);

        toast.add({
            severity: 'info',
            summary: 'Інформація',
            detail: 'Фото видалено',
            life: 3000
        });
    } catch (error) {
        console.error('Ошибка при удалении изображения:', error);
        toast.add({
            severity: 'error',
            summary: 'Помилка',
            detail: 'Не вдалося видалити фотографію',
            life: 3000
        });
    }
};

const handleReorder = (newOrder) => {
    emit('reorder', newOrder);
};
</script>
