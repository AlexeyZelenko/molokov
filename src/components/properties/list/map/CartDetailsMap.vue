<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    marker: Object
});

const emit = defineEmits(['close-modal']);
const router = useRouter();
// Логика кнопок
const showProperty = () => {
    const category = props.marker.item.category.code;
    const subcategory = props.marker.item.subcategory.code;
    const id = props.marker.item.id;
    router.push(`/pages/${category}/view/${subcategory}/${id}?category=${category}&subcategory=${subcategory}`);
};

const closeModal = () => {
    emit('close-modal');
};
</script>

<template>
    <Card style="width: 25rem; overflow: hidden">
        <template #header>
            <Galleria v-if="props.marker?.item?.images?.length" :value="props.marker.item.images" :numVisible="5" :circular="true" containerStyle="max-width: 640px; height: 400px;" :showItemNavigators="true" :showThumbnails="false">
                <template #item="slotProps">
                    <transition name="fade">
                        <img :key="slotProps.item" :src="slotProps.item" :alt="slotProps.item.alt || 'Image'" class="fixed-image" loading="lazy" />
                    </transition>
                </template>
            </Galleria>
        </template>
        <template #title>{{ props.marker.item.title }}</template>
        <template #subtitle>{{ props.marker.item.subcategory.name }}</template>
        <template #content>
            <p class="m-0" v-html="props.marker.text"></p>
            <p class="m-0">Ціна: {{ props.marker.item.price }} грн</p>
            <p class="m-0">Кімнат: {{ props.marker.item.rooms.all }}</p>
            <p class="m-0">Площа: {{ props.marker.item.apartmentArea.totalArea }} m2</p>
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1">
                <Button label="Перейти до об'єкту" severity="secondary" outlined class="w-full" @click="showProperty" />
                <Button label="Закрити" class="w-full" @click="closeModal" />
            </div>
        </template>
    </Card>
</template>

<style scoped>
.fixed-image {
    width: 100%;
    height: 400px; /* Фиксированная высота */
    object-fit: cover; /* Заполняет область, не искажая изображение */
    display: block;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
