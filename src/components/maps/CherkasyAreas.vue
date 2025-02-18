<template>
    <div class="map-container">
        <div class="controls">
            <select v-model="selectedArea" class="area-select">
                <option value="all">Всі райони</option>
                <option v-for="area in validAreas"
                        :key="area.code"
                        :value="area.code">
                    {{ area.name }}
                </option>
            </select>
        </div>
        <div ref="mapContainer" style="width: 100%; height: 600px"></div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import * as leaflet from 'leaflet/dist/leaflet-src.esm';
import 'leaflet/dist/leaflet.css';
import {useAreasStore} from "@/store/areasStore";

const mapContainer = ref(null);
const map = ref(null);
const circles = ref([]);
const selectedArea = ref('all');
const areasStore = useAreasStore();
const areas = areasStore.areas;

const validAreas = areas.filter(area => area.position);

const clearCircles = () => {
    circles.value.forEach(circle => {
        map.value.removeLayer(circle);
    });
    circles.value = [];
};

const drawArea = (area) => {
    if (!area.position) return;

    const circle = leaflet.circle([area.position.lat, area.position.lng], {
        color: area.color,
        fillColor: area.color,
        fillOpacity: 0.2,
        radius: area.radius
    });

    circle.bindPopup(`
    <div class="area-popup">
      <h3 style="color: black">${area.name}</h3>
      <p>Радиус: ${area.radius}м</p>
    </div>
  `);

    circle.addTo(map.value);
    circles.value.push(circle);
};

const updateMap = () => {
    clearCircles();

    if (selectedArea.value === 'all') {
        validAreas.forEach(area => drawArea(area));

        // Подстраиваем зум чтобы вместить все районы
        const bounds = leaflet.latLngBounds(validAreas.map(area => [area.position.lat, area.position.lng]));
        map.value.fitBounds(bounds, { padding: [50, 50] });
    } else {
        const area = validAreas.find(a => a.code === selectedArea.value);
        if (area) {
            drawArea(area);
            map.value.setView([area.position.lat, area.position.lng], 14);
        }
    }
};

watch(selectedArea, updateMap);

onMounted(() => {
    // Инициализация карты с центром на Черкассах
    map.value = leaflet.map(mapContainer.value).setView([49.4444, 32.0598], 13);

    // Добавление слоя OpenStreetMap
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map.value);

    // Отображаем все районы при инициализации
    updateMap();
});
</script>

<style scoped>
.map-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.controls {
    padding: 10px;
}

.area-select {
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

:deep(.area-popup) {
    min-width: 150px;
    text-align: center;
}

:deep(.area-popup h3) {
    margin: 5px 0;
    font-size: 16px;
}

:deep(.area-popup p) {
    margin: 5px 0;
    color: #666;
}
</style>
