<template>
    <div class="location-picker">
        <div v-if="mapError" class="error-message">
            {{ mapError }}
        </div>

        <div v-if="!isMapLoaded" class="loading-message">
            Завантаження карти...
        </div>

        <template v-if="isMapLoaded && !mapError">
            <GoogleMap
                :api-key="apiKey"
                class="map-container"
                :center="mapCenter"
                :zoom="12"
                mapTypeId="terrain"
                @click="handleMapClick"
            >
                <Marker
                    v-if="markerPosition"
                    :options="{
                        position: markerPosition,
                        draggable: true,
                    }"
                    @dragend="handleMarkerDrag"
                />

                <Circle
                    v-if="selectedArea"
                    :key="selectedArea.code"
                    :options="getCircleOptions(selectedArea)"
                />
            </GoogleMap>

            <div v-if="markerPosition" class="coordinates-display">
                <p>Координати: {{ formatCoordinates(markerPosition.lat) }}, {{ formatCoordinates(markerPosition.lng) }}</p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMap, Marker, Circle } from "vue3-google-map";
import { useAreasStore } from "@/store/areasStore";

// Типы
interface Coordinates {
    lat: number;
    lng: number;
}

interface Area {
    code: string;
    position: Coordinates;
    radius: number;
    color: string;
}

// Props
const props = defineProps({
    area: {
        type: Object as () => Area | undefined,
        default: undefined,
    },
    center: {
        type: Object as () => Coordinates,
        default: () => ({ lat: 49.4444, lng: 32.0594 }),
    },
});

// Emits
const emit = defineEmits<{
    'update-marker-position': [position: Coordinates];
    'error': [error: Error];
}>();

// Состояние
const markerPosition = ref<Coordinates | null>(null);
const isMapLoaded = ref(false);
const mapError = ref<string | null>(null);
const mapCenter = computed(() => markerPosition.value || props.center);

// Store
const areasStore = useAreasStore();
const areas = computed(() => areasStore.areas);
const selectedArea = computed(() => areasStore.selectedArea);

// API ключ (используем один на все приложение)
const apiKey = ref('AIzaSyCqfYBHSSatxDzAt9kU3IFFVyTk2BmaZzI');

// Инициализация Google Maps
let loader: any = null;

const initializeGoogleMaps = async () => {
    try {
        if (!loader) {
            loader = new Loader({
                apiKey: apiKey.value,
                version: 'weekly',
                libraries: ['places', 'marker'],
            });
        }

        await loader.load();
        isMapLoaded.value = true;
        mapError.value = null;
    } catch (error) {
        console.error('Google Maps initialization error:', error);
        mapError.value = 'Помилка завантаження карти. Будь ласка, перевірте підключення до інтернету та спробуйте ще раз.';
        emit('error', new Error('Google Maps initialization failed'));
    }
};

// Обработчики событий
const handleMapClick = (event: google.maps.MouseEvent) => {
    try {
        if (!event.latLng) return;

        const newPosition: Coordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        markerPosition.value = newPosition;
        emit('update-marker-position', newPosition);
    } catch (error) {
        console.error('Map click error:', error);
        emit('error', new Error('Помилка при встановленні мітки'));
    }
};

const handleMarkerDrag = (event: google.maps.MapMouseEvent) => {
    try {
        if (!event.latLng) return;

        const newPosition: Coordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        markerPosition.value = newPosition;
        emit('update-marker-position', newPosition);
    } catch (error) {
        console.error('Marker drag error:', error);
        emit('error', new Error('Помилка при переміщенні мітки'));
    }
};

// Вспомогательные функции
const formatCoordinates = (coord: number): string => {
    return coord.toFixed(6);
};

const getCircleOptions = (area: Area) => {
    return {
        center: area.position,
        radius: area.radius,
        strokeColor: area.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: area.color,
        fillOpacity: 0.35,
    };
};

// Watches
watch(() => props.area, (newArea) => {
    if (newArea?.code) {
        const area = areas.value.find(a => a.code === newArea.code);
        if (area) {
            areasStore.setSelectedArea(area);
        }
    }
}, { immediate: true });

// Lifecycle hooks
onMounted(async () => {
    await initializeGoogleMaps();
    if (props.center) {
        markerPosition.value = props.center;
    }
});

onUnmounted(() => {
    // Очистка ресурсов при необходимости
    loader = null;
});
</script>

<style scoped>
.location-picker {
    width: 100%;
    position: relative;
}

.map-container {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
}

.error-message {
    text-align: center;
    padding: 1rem;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.loading-message {
    text-align: center;
    padding: 1rem;
    background-color: #e2e3e5;
    color: #383d41;
    border: 1px solid #d6d8db;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.coordinates-display {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}
</style>
