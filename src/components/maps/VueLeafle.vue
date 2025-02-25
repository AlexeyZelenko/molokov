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
import * as Leaflet from 'leaflet';

import * as L from 'leaflet/dist/leaflet-src.esm';

// Настройка иконок при монтировании компонента
onMounted(() => {
    if (L.Icon && L.Icon.Default) {
        L.Icon.Default.mergeOptions({
            iconUrl: '/leaflet-images/marker-icon.png',
            iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
            shadowUrl: '/leaflet-images/marker-shadow.png'
        });
    }
});

const props = defineProps({
    marker: {
        type: Array,
        required: false,
        default: () => []
    }
});

const emit = defineEmits(['update:marker']);

const zoom = ref(6);
const defaultCenter = [49.4444, 32.0598];

const markerExists = computed(() => {
    return Array.isArray(props.marker) &&
        props.marker.length === 2 &&
        !isNaN(props.marker[0]) &&
        !isNaN(props.marker[1]);
});

const center = computed(() => {
    return markerExists.value ? props.marker : defaultCenter;
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
