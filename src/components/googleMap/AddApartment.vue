<template>
    <div class="location-picker">
        <GoogleMap
            :api-key="apiKey"
            style="width: 100%; height: 500px"
            :center="center"
            :zoom="12"
            mapTypeId="terrain"
            @click="handleMapClick"
        >
            <Marker v-if="markerPosition" :options="{ position: markerPosition || center }" />

            <!-- Отображаем круг для выбранного района -->
            <Circle
                v-if="selectedArea"
                :key="selectedArea.code"
                :options="{
                  center: selectedArea.position,
                  radius: selectedArea.radius,
                  strokeColor: selectedArea.color,
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: selectedArea.color,
                  fillOpacity: 0.35,
                }"
            />
        </GoogleMap>

        <div v-if="markerPosition">
            <p>Координаты: {{ markerPosition.lat }}, {{ markerPosition.lng }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted} from "vue";
import { GoogleMap, Marker, Circle } from "vue3-google-map";
import { useAreasStore } from "@/store/areasStore"; // Импортируем store

const markerPosition = ref(null);
const emit = defineEmits(['update-marker-position']);

// Обработчик клика по карте
const handleMapClick = (event: google.maps.MouseEvent) => {
    const lat = event.latLng.lat(); // Получаем широту
    const lng = event.latLng.lng(); // Получаем долготу
    console.log('lat:', lat, 'lng:', lng);
    markerPosition.value = { lat: lat, lng: lng }; // Устанавливаем новые координаты

    emit('update-marker-position', markerPosition.value); // Отправляем новые координаты в родительский компонент
};

// Получаем данные через store
const areasStore = useAreasStore();
const areas = computed(() => areasStore.areas); // Получаем список всех районов из store
const selectedArea = computed(() => areasStore.selectedArea); // Получаем выбранный район из store

const props = defineProps({
    area: {
        type: Object,
        default: () => ({}),
        required: false,
    },
    center: {
        type: Object,
        default: () => ({}),
        required: false,
    },
});

// Центр карты (по умолчанию)
const center = { lat: 49.4444, lng: 32.0594 };

// Состояние для выбранного района
const selectedAreaCode = ref("");

// Функция для выбора района
const selectArea = (code: string) => {
    const area = areas.value.find(a => a.code === code);
    if (area) {
        areasStore.setSelectedArea(area); // Обновляем выбранный район в store
    }
};

// Реагируем на изменение пропса area
watch(() => props.area, (newArea) => {
    if (newArea && newArea.code) {
        selectArea(newArea.code); // Обновляем выбранный район
    }
}, { immediate: true });

// Получаем ключ API из переменных окружения
const apiKey = ref(
    'AIzaSyCqfYBHSSatxDzAt9kU3IFFVyTk2BmaZzI'
);

onMounted(() => {
    markerPosition.value = props.center;
});
</script>

<style scoped>
.location-picker {
    width: 100%;
}
</style>
