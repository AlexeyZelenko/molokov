<template>
    <div class="map-container">
        <div ref="mapContainer" style="width: 100%; height: 500px"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import * as leaflet from 'leaflet/dist/leaflet-src.esm';
import 'leaflet/dist/leaflet.css';

// Принимаем props
const props = defineProps({
    area: {
        type: Object,
        required: true,
        default: () => ({})
    },
    marker: {
        type: Array,
        required: false,
        default: () => []
    },
});

const emit = defineEmits(['update:marker']);

const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);

// Функция для создания или обновления маркера
const updateMarker = (position) => {
    if (!map.value) {
        console.warn("Карта еще не инициализирована, пропускаем updateMarker");
        return;
    }

    if (!position || !Array.isArray(position) || position.length !== 2) {
        console.warn("Некорректные координаты маркера:", position);
        return;
    }

    if (!marker.value) {
        // Создаем маркер, если его еще нет
        marker.value = leaflet.marker(position, { draggable: true }).addTo(map.value);
        marker.value.on('dragend', (event) => {
            const newPosition = event.target.getLatLng();
            emit('update:marker', [newPosition.lat, newPosition.lng]);
        });
    } else {
        // Обновляем существующий маркер
        marker.value.setLatLng(position);
    }
};

// Инициализация карты
onMounted(async () => {
    console.log('MapWithMarkerEdit mounted', props.marker);
    await nextTick();

    if (!mapContainer.value) {
        console.error("Контейнер для карты не найден!");
        return;
    }

    map.value = leaflet.map(mapContainer.value).setView(
        props.marker?.length === 2 ? props.marker : [0, 0],
        13
    );

    // Добавление слоя OpenStreetMap
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
    }).addTo(map.value);

    await nextTick(); // Дожидаемся обновления DOM

    if (props.marker?.length === 2) {
        updateMarker(props.marker);
    }

    // Обработчик клика по карте для установки маркера
    map.value.on('click', (event) => {
        const newPosition = event.latlng;
        updateMarker([newPosition.lat, newPosition.lng]);
        emit('update:marker', [newPosition.lat, newPosition.lng]);
    });
});

// Следим за изменением `props.marker`
watch(
    () => props.marker,
    (newMarker) => {
        if (newMarker?.length === 2) {
            updateMarker(newMarker);
        }
    },
    { deep: true }
);
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
}
</style>
