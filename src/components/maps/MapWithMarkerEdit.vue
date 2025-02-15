<template>
    <div class="map-container">
        <div ref="mapContainer" style="width: 100%; height: 500px"></div>
        <div class="controls">
            <button
                v-if="hasMarker"
                @click="removeMarker"
                class="control-button remove-button"
            >
                Видалити маркер
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import * as leaflet from 'leaflet/dist/leaflet-src.esm';
import 'leaflet/dist/leaflet.css';
import { useAreasStore } from '@/store/areasStore';

// Принимаем props
const props = defineProps({
    marker: {
        type: Array,
        required: false,
        default: () => []
    },
    property: {
        type: Object,
        required: false,
        default: () => ({})
    }
});

const emit = defineEmits(['update:marker']);

const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const areaCircle = ref(null);
const hasMarker = computed(() => !!marker.value);

const area = computed(() => props.property?.address?.area);

// Получаем информацию о районе из store
const areasStore = useAreasStore();
const currentArea = computed(() => {
    try {
        const areaCode = props.property?.address?.area?.code;
        if (!areaCode) return null;

        return areasStore?.areas?.find(area => area.code === areaCode) ?? null;
    } catch (error) {
        console.error('Error computing current area:', error);
        return null;
    }
});

// Функция для создания или обновления маркера
const updateMarker = (position) => {
    if (!map.value) {
        console.warn("Карта еще не инициализирована, пропускаем updateMarker");
        return;
    }

    if (!position || !Array.isArray(position) || position.length !== 2 ||
        isNaN(position[0]) || isNaN(position[1])) {
        if (marker.value) {
            removeMarker();
        }
        return;
    }

    if (!marker.value) {
        // Создаем маркер, если его еще нет
        marker.value = leaflet.marker(position, {
            draggable: props.editable
        }).addTo(map.value);

        // Добавляем всплывающее окно, если есть данные
        const areaName = props.property?.address?.area?.name || '';
        const street = props.property?.address?.street || '';
        if (areaName || street) {
            const popupContent = [areaName, street].filter(Boolean).join(' - ');
            marker.value.bindPopup(popupContent).openPopup();
        }

        // Обработчик перетаскивания, если маркер редактируемый
        if (props.editable) {
            marker.value.on('dragend', (event) => {
                const newPosition = event.target.getLatLng();
                updatePropertyMarker([newPosition.lat, newPosition.lng]);
            });
        }
    } else {
        // Обновляем существующий маркер
        marker.value.setLatLng(position);
    }
};

// Удаление маркера
const removeMarker = () => {
    if (marker.value) {
        map.value.removeLayer(marker.value);
        marker.value = null;
        emit('update:marker', []);
    }
};

// Функция для создания или обновления круга района
const updateAreaCircle = () => {
    if (!map.value || !currentArea.value) return;

    // Если круг уже существует, удаляем его
    if (areaCircle.value) {
        map.value.removeLayer(areaCircle.value);
    }

    // Создаем новый круг
    console.log('currentArea.value', currentArea.value);
    const center = currentArea.value.position || [49.4444, 32.0598]; // Используем центр из area или значение по умолчанию
    areaCircle.value = leaflet.circle(center, {
        color: currentArea.value.color || '#f7f5f5',
        fillColor: currentArea.value.color || '#f7f5f5',
        fillOpacity: 0.2,
        radius: currentArea.value.radius || 1000
    }).addTo(map.value);

    // Если нет маркера, центрируем карту на районе
    if (!marker.value && !props.marker?.length) {
        map.value.setView(center, currentArea.value?.zoom || 13);
    }
};

// Инициализация карты
onMounted(async () => {
    await nextTick();

    if (!mapContainer.value) {
        console.error("Контейнер для карты не найден!");
        return;
    }

    // Начальные координаты и масштаб
    const initialCoords = props.marker?.length === 2
        ? props.marker
        : currentArea.value?.center || area.value?.center || [0, 0];

    const initialZoom = area.value?.zoom || 13;

    map.value = leaflet.map(mapContainer.value).setView(initialCoords, initialZoom);

    // Добавление слоя OpenStreetMap
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
    }).addTo(map.value);

    await nextTick(); // Дожидаемся обновления DOM

    // Добавляем круг района, если есть информация
    updateAreaCircle();

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
        } else if (newMarker?.length === 0 && marker.value) {
            removeMarker();
        }
    },
    {deep: true}
);

// Следим за изменением района
watch(
    currentArea,
    () => {
        updateAreaCircle();
    },
    {deep: true}
);
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.controls {
    position: absolute;
    bottom: 20px;
    right: 10px;
    z-index: 1000;
}

.control-button {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.remove-button {
    background: #f44336;
    color: white;
    border: none;
}

.remove-button:hover {
    background: #d32f2f;
}
</style>
