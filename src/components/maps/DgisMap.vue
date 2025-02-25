<template>
    sdsadasd
    <div class="map-container">
        <div ref="mapContainer" style="width: 100%; height: 500px"></div>
        <div v-if="hasMarker && isDelete" class="controls">
            <button
                @click="removeMarker"
                class="control-button remove-button"
            >
                Удалить маркер
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed, onBeforeUnmount } from 'vue';
import * as leaflet from 'leaflet/dist/leaflet-src.esm';
import 'leaflet/dist/leaflet.css';
import { useAreasStore } from '@/store/areasStore';
import * as Leaflet from "leaflet";

const props = defineProps({
    property: {
        type: Object,
        required: true,
        default: () => ({})
    },
    editable: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:property']);

const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);
const areaCircle = ref(null);
const hasMarker = computed(() => !!marker.value);

// Получаем информацию о районе из store
const areasStore = useAreasStore();
const currentArea = computed(() => {
    try {
        const areaCode = props.property?.address?.area?.code;
        if (!areaCode) return null;

        return areasStore.areas.find(area => area.code === areaCode) ?? null;
    } catch (error) {
        console.error('Error computing current area:', error);
        return null;
    }
});

// Получаем позицию маркера из property
const markerPosition = computed(() => {
    const position = props.property?.address?.markerPosition;
    if (Array.isArray(position) && position.length === 2) {
        return position;
    }
    return null;
});

// Функция для создания или обновления маркера
const updateMarker = (position) => {
    if (!map.value) {
        console.warn("Карта еще не инициализирована, пропускаем updateMarker");
        return;
    }

    if (!position || !Array.isArray(position) || position.length !== 2) {
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
        if (props.property?.address?.area?.name) {
            const popupContent = `${props.property.address.area.name}${props.property.address.street ? ' - ' + props.property.address.street : ''}`;
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

        if (props.editable) {
            updatePropertyMarker(null);
        }
    }
};

// Обновление позиции маркера в property через emit
const updatePropertyMarker = (position) => {
    // Клонируем property для избежания мутаций
    const updatedProperty = JSON.parse(JSON.stringify(props.property));

    // Создаем структуру address, если её нет
    if (!updatedProperty.address) {
        updatedProperty.address = {};
    }

    // Устанавливаем или очищаем позицию маркера
    updatedProperty.address.markerPosition = position;

    emit('update:property', updatedProperty);
};

// Функция для создания или обновления круга района
const updateAreaCircle = () => {
    if (!map.value) return;

    // Если круг уже существует, удаляем его
    if (areaCircle.value) {
        map.value.removeLayer(areaCircle.value);
        areaCircle.value = null;
    }

    if (!currentArea.value) return;

    // Получаем центр района
    const center = currentArea.value.position ?? [49.4444, 32.0598];

    // Создаем новый круг
    areaCircle.value = leaflet.circle(center, {
        color: currentArea.value.color || '#f7f5f5',
        fillColor: currentArea.value.color || '#f7f5f5',
        fillOpacity: 0.1,
        radius: currentArea.value.radius || 1000
    }).addTo(map.value);
};

// Инициализация карты
onMounted(async () => {
    await nextTick();

    if (!mapContainer.value) {
        console.error("Контейнер для карты не найден!");
        return;
    }

    // Определяем начальные координаты и масштаб
    const markerPos = markerPosition.value;
    const areaCenter = currentArea.value?.center;
    const initialCoords = markerPos || areaCenter || [49.4444, 32.0598];
    const initialZoom = 13;

    // Создаем карту
    map.value = leaflet.map(mapContainer.value).setView(initialCoords, initialZoom);

    // Добавление слоя OpenStreetMap
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
    }).addTo(map.value);

    // Добавляем круг района
    updateAreaCircle();

    // Добавляем маркер, если есть координаты
    if (markerPos) {
        updateMarker(markerPos);
    }

    // Обработчик клика по карте для установки маркера (только если редактируемый)
    if (props.editable) {
        map.value.on('click', (event) => {
            const newPosition = [event.latlng.lat, event.latlng.lng];
            updateMarker(newPosition);
            updatePropertyMarker(newPosition);
        });
    }
});

// Следим за изменением позиции маркера
watch(
    markerPosition,
    (newPosition) => {
        if (newPosition) {
            updateMarker(newPosition);
        } else if (marker.value) {
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

// Очистка при уничтожении компонента
onBeforeUnmount(() => {
    if (map.value) {
        map.value.remove();
        map.value = null;
    }
});


const L = Leaflet;

// Настройка иконок при монтировании компонента
onMounted(() => {
    if (L.Icon && L.Icon.Default) {
        // Переопределяем пути к иконкам
        L.Icon.Default.mergeOptions({
            iconUrl: '/leaflet-images/marker-icon.png',
            iconRetinaUrl: '/leaflet-images/marker-icon-2x.png',
            shadowUrl: '/leaflet-images/marker-shadow.png'
        });
    }
});
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
    bottom: 10px;
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
