<template>
    <div ref="mapContainer" style="width: 100%; height: 500px"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as leaflet from 'leaflet/dist/leaflet-src.esm';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
    property: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

const mapContainer = ref(null);

onMounted(() => {
    const marker = props.property.address.markerPosition || [49.4444, 32.0598];
    // Initialize map
    const map = leaflet.map(mapContainer.value).setView(marker, 13);

    // Add OpenStreetMap tiles
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker with popup
    leaflet.marker(marker)
        .addTo(map)
        .bindPopup(`Cherkasy Center - ${props.property.address.markerPosition}`)
        .openPopup();

    // Add circle
    leaflet.circle([49.4444, 32.0598], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);
});
</script>

<style>
/* Make sure the map container has a defined height */
#map {
    height: 100%;
    width: 100%;
}
</style>
