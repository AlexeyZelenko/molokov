<template>
    <Card style="width: 25rem; overflow: hidden">
        <template #header>
            <Galleria :value="props.marker.item.images" :numVisible="5" :circular="true" containerStyle="max-width: 640px"
                      :showItemNavigators="true" :showThumbnails="false">
                <template #item="slotProps">
                    <img :src="slotProps.item" :alt="slotProps.item.alt" style="width: 100%; display: block;" />
                </template>
                <template #thumbnail="slotProps">
                    <img :src="slotProps.item" :alt="slotProps.item.alt" style="display: block;" />
                </template>
            </Galleria>
        </template>
        <template #title>{{ props.marker.item.title}}</template>
        <template #subtitle>{{ props.marker.item.subcategory.name}}</template>
        <template #content>
            <p class="m-0" v-html="props.marker.text"></p>
            <p class="m-0">Ціна: {{props.marker.item.price}} грн</p>
            <p class="m-0">Кімнат: {{props.marker.item.rooms.all}}</p>
            <p class="m-0">Площа: {{props.marker.item.apartmentArea.totalArea}} m2</p>
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1">
                <Button
                    label="Перейти до об'єкту"
                    severity="secondary"
                    outlined
                    class="w-full"
                    @click="showProperty"
                />
                <Button
                    label="Закрити"
                    class="w-full"
                    @click="closeModal"
                />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue';
import {useRouter} from 'vue-router';

const props = defineProps({
    marker: Object,
});

const emit = defineEmits(['close-modal']);
const router = useRouter();
// Логика кнопок
const showProperty = (marker) => {
    console.log('Show property:', marker.item);
    router.push(`/pages/apartments/view/${marker.item.id}?category=${marker.item.category.code}&subcategory=${marker.item.subcategory.code}`);
};

const closeModal = () => {
    emit('close-modal');
};

onMounted(() => {
    console.log('Marker:', props.marker);
});
</script>
