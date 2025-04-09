<template>
    <div>
        <div v-if="!images || images.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <i class="pi pi-images text-5xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">Немає завантажених фотографій</p>
        </div>

        <transition-group
            name="image-grid"
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
            <div
                v-for="(image, index) in images"
                :key="typeof image === 'string' ? image : image.url || index"
                class="image-item border rounded-lg overflow-hidden relative group cursor-move"
                :class="{'dragging': draggedIndex === index}"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragend="handleDragEnd"
                @dragover.prevent="handleDragOver($event, index)"
                @dragenter.prevent="handleDragEnter($event, index)"
            >
                <div class="image-container relative" style="aspect-ratio: 1/1;">
                    <img
                        :src="typeof image === 'string' ? image : image.url"
                        :alt="`Фото ${index + 1}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />

                    <div class="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-xs z-10" v-if="index === 0">
                        Головне фото
                    </div>

                    <div class="absolute top-2 right-2 bg-white bg-opacity-70 text-gray-800 px-2 py-1 rounded-full text-xs z-10">
                        {{ index + 1 }}/{{ images.length }}
                    </div>

                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div class="flex gap-2">
                            <Button
                                icon="pi pi-search"
                                @click.stop="enlargeImage(typeof image === 'string' ? image : image.url)"
                                rounded
                                aria-label="Переглянути"
                            />
                            <Button
                                icon="pi pi-star"
                                @click.stop="setAsMain(index)"
                                rounded
                                :class="[ index === 0 ? 'p-button-warning' : 'p-button-secondary']"
                                aria-label="Зробити головним"
                                v-if="index !== 0"
                            />
                            <Button
                                icon="pi pi-trash"
                                @click.stop="removeImage(index)"
                                rounded
                                severity="danger"
                                aria-label="Видалити"
                            />
                        </div>
                    </div>
                </div>

                <div class="p-2 bg-white border-t flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="pi pi-bars text-gray-400 mr-2"></i>
                        <span class="text-sm">{{ getImageName(image, index) }}</span>
                    </div>
                </div>
            </div>
        </transition-group>

        <Dialog v-model:visible="enlargedImageVisible" modal class="enlarged-image-dialog" :style="{ width: '90vw', maxWidth: '1200px' }">
            <div class="flex justify-center">
                <img :src="enlargedImageSrc" alt="Збільшене зображення" class="max-w-full max-h-[80vh] object-contain" />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const props = defineProps({
    images: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:images', 'remove', 'reorder']);

const draggedIndex = ref(null);
const dragOverIndex = ref(null);
const enlargedImageVisible = ref(false);
const enlargedImageSrc = ref('');

// Начало перетаскивания
const handleDragStart = (event, index) => {
    draggedIndex.value = index;
    event.dataTransfer.effectAllowed = 'move';

    // Устанавливаем прозрачное изображение для перетаскивания (для лучшего UX)
    const dragImage = document.createElement('div');
    dragImage.style.width = '1px';
    dragImage.style.height = '1px';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    // Сохраняем индекс элемента, который перетаскиваем
    event.dataTransfer.setData('text/plain', index);

    // Добавляем небольшую задержку перед добавлением класса для анимации
    setTimeout(() => {
        document.body.removeChild(dragImage);
    }, 0);
};

// Когда перетаскивание над другим элементом
const handleDragOver = (event, index) => {
    if (draggedIndex.value === null) return;
    dragOverIndex.value = index;
    event.dataTransfer.dropEffect = 'move';
};

// Когда курсор входит в область элемента
const handleDragEnter = (event, index) => {
    if (draggedIndex.value === null || draggedIndex.value === index) return;

    const newImages = [...props.images];
    const draggedImage = newImages[draggedIndex.value];

    // Удаляем изображение с текущей позиции
    newImages.splice(draggedIndex.value, 1);

    // Вставляем изображение на новую позицию
    newImages.splice(index, 0, draggedImage);

    // Обновляем индекс перетаскиваемого элемента
    draggedIndex.value = index;

    // Сообщаем родительскому компоненту о новом порядке
    emit('reorder', newImages);
};

// Конец перетаскивания
const handleDragEnd = () => {
    draggedIndex.value = null;
    dragOverIndex.value = null;
};

// Установить изображение как главное (первое)
const setAsMain = (index) => {
    if (index === 0) return;

    const newImages = [...props.images];
    const mainImage = newImages[index];

    // Удаляем изображение с текущей позиции
    newImages.splice(index, 1);

    // Вставляем изображение на первую позицию
    newImages.unshift(mainImage);

    // Сообщаем родительскому компоненту о новом порядке
    emit('reorder', newImages);
};

// Удалить изображение
const removeImage = (index) => {
    const imageToRemove = props.images[index];
    emit('remove', typeof imageToRemove === 'object' ? imageToRemove : imageToRemove.url);
};

// Увеличить изображение
const enlargeImage = (src) => {
    enlargedImageSrc.value = src;
    enlargedImageVisible.value = true;
};

// Получить имя изображения
const getImageName = (image, index) => {
    if (typeof image === 'string') {
        // Если это URL-строка, извлекаем имя файла
        const parts = image.split('/');
        const filename = parts[parts.length - 1].split('?')[0];
        return filename.length > 15 ? filename.substring(0, 12) + '...' : filename;
    } else if (image && image.name) {
        // Если это объект с полем name
        return image.name.length > 15 ? image.name.substring(0, 12) + '...' : image.name;
    } else {
        // Если нет информации о имени, используем индекс
        return `Фото ${index + 1}`;
    }
};
</script>

<style scoped>
.image-item {
    transition: all 0.3s ease;
    z-index: 1;
}

.image-item:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    z-index: 10;
}

.image-item.dragging {
    opacity: 0.5;
    border: 2px dashed #6b7280; /* gray-500 */
    transform: scale(0.98);
}

.image-grid-enter-active,
.image-grid-leave-active {
    transition: all 0.3s ease;
}
.image-grid-enter-from,
.image-grid-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.enlarged-image-dialog .p-dialog-content {
    padding: 0 !important;
    background-color: #000;
}

.enlarged-image-dialog img {
    border-radius: 4px;
}
</style>
