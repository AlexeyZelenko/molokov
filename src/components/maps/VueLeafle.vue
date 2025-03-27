<template>
    <div style="height:600px; width:100%" class="map-container">
        <div v-if="markerExists" class="marker-info">
            Координати маркера: {{ marker[0].toFixed(6) }}, {{ marker[1].toFixed(6) }}
            <button @click="removeMarker" class="remove-button">Видалити маркер</button>
        </div>
        <div v-else class="marker-info">
            Натисніть на карту, щоб додати маркер
        </div>
        <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            @click="handleMapClick"
            @update:zoom="newZoom => zoom = newZoom"
        >
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>

            <l-marker
                v-if="markerExists"
                :lat-lng="marker"
                draggable
                @dragend="handleDragEnd"
            >
            </l-marker>
        </l-map>
    </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import {ref, computed, onUnmounted, onMounted} from 'vue';
import {LMap, LTileLayer, LMarker} from "@vue-leaflet/vue-leaflet";
// Исправление импорта - используем импорт всего модуля, а не default export
import * as Leaflet from 'leaflet';

// Создание переменной L для совместимости с традиционным использованием Leaflet
const L = Leaflet;

// Настройка иконок при монтировании компонента
onMounted(() => {
    // Проверяем наличие Icon и Icon.Default
    if (L.Icon && L.Icon.Default) {
        // Переопределяем пути к иконкам
        L.Icon.Default.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
        });
    }
});

const props = defineProps({
    marker: {
        type: Array,
        required: false,
        default: () => []
    },
    centerMap: {
        type: Array,
        required: false,
        default: () => [49.4444, 32.0598]
    }
});

const emit = defineEmits(['update:marker']);

const zoom = ref(13);
const center = computed(() => {
    // Проверяем наличие маркера и его валидность
    if (markerExists.value) {
        return props.marker;
    }

    // Проверяем centerMap на валидность
    if (Array.isArray(props.centerMap) && props.centerMap.length === 2 &&
        typeof props.centerMap[0] === 'number' && typeof props.centerMap[1] === 'number') {
        return props.centerMap;
    }

    // Возвращаем значение по умолчанию
    return [49.4444, 32.0598];
});

const markerExists = computed(() => {
    return Array.isArray(props.marker) &&
        props.marker.length === 2 &&
        !isNaN(props.marker[0]) &&
        !isNaN(props.marker[1]);
});

const handleMapClick = (e) => {
    const newCoordinates = [e.latlng.lat, e.latlng.lng];
    emit('update:marker', newCoordinates);
};

const handleDragEnd = (e) => {
    const newCoordinates = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    emit('update:marker', newCoordinates);
};

const removeMarker = () => {
    emit('update:marker', []);
};

onUnmounted(() => {
    removeMarker();
});
</script>

<style scoped>
.map-container {
    position: relative;
}

.marker-info {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    background: white;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.remove-button {
    margin-left: 10px;
    cursor: pointer;
    background: #ff5252;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
}
</style>
