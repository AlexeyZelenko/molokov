<template>
    <div class="map-container">
        <div ref="mapContainer" style="width: 100%; height: 500px"></div>
<!--        <div class="controls">-->
<!--            <button @click="toggleAddMarkerMode" :class="{ active: isAddingMarkers }">-->
<!--                {{ isAddingMarkers ? 'Stop Adding Markers' : 'Start Adding Markers' }}-->
<!--            </button>-->
<!--            <button @click="clearMarkers" :disabled="markers.length === 0">-->
<!--                Clear All Markers-->
<!--            </button>-->
<!--            <button @click="exportMarkers" :disabled="markers.length === 0">-->
<!--                Export Markers-->
<!--            </button>-->
<!--            <input-->
<!--                type="file"-->
<!--                ref="fileInput"-->
<!--                style="display: none"-->
<!--                accept=".json"-->
<!--                @change="importMarkers"-->
<!--            >-->
<!--            <button @click="$refs.fileInput.click()">-->
<!--                Import Markers-->
<!--            </button>-->
<!--        </div>-->
    </div>

    <!-- Modal for editing marker text -->
    <div v-if="editingMarker" class="modal">
        <div class="modal-content">
            <CartDetailsMap
                :marker="editingMarker"
                @close-modal="closeModal"
                :editingMarker="editingMarker"
            />
        </div>
    </div>
</template>

<script setup>
import {defineProps, onMounted, ref, watch} from "vue";
import * as leaflet from 'leaflet/dist/leaflet-src.esm';
import 'leaflet/dist/leaflet.css';
import {useRouter} from 'vue-router';
import CartDetailsMap from "@/components/properties/list/map/CartDetailsMap.vue";

const router = useRouter();
const mapContainer = ref(null);
const map = ref(null);
const markers = ref([]);
const isAddingMarkers = ref(false);
const editingMarker = ref(null);
const fileInput = ref(null);

const props = defineProps({
    items: Array
});

const closeModal = () => {
    editingMarker.value = null;
};
const toggleAddMarkerMode = () => {
    isAddingMarkers.value = !isAddingMarkers.value;
};

const createMarkerPopupContent = (marker) => {
    const div = document.createElement('div');
    div.innerHTML = `
   <div class="marker-popup">
     <p>${marker.text || 'No description'}</p>
     <div class="popup-buttons">
       <button class="edit-btn">Деталі</button>
     </div>
   </div>
 `;

    div.querySelector('.edit-btn').addEventListener('click', () => {
        editingMarker.value = marker;
    });

    return div;
};
const addMarker = (e) => {
    if (!isAddingMarkers.value) return;

    const { lat, lng } = e.latlng;
    const markerData = {
        lat,
        lng,
        text: `Marker ${markers.value.length + 1}\nLat: ${lat.toFixed(4)}\nLng: ${lng.toFixed(4)}`,
        id: Date.now()
    };

    const newMarker = leaflet.marker([lat, lng], {
        draggable: true
    });

    newMarker.markerData = markerData;

    newMarker
        .addTo(map.value)
        .bindPopup(createMarkerPopupContent(markerData))
        .openPopup();

    // Обработчик перетаскивания
    newMarker.on('dragend', (event) => {
        const marker = event.target;
        const position = marker.getLatLng();
        marker.markerData.lat = position.lat;
        marker.markerData.lng = position.lng;
        marker.setPopupContent(createMarkerPopupContent(marker.markerData));
    });

    // Удаление по правому клику
    newMarker.on('contextmenu', () => {
        map.value.removeLayer(newMarker);
        markers.value = markers.value.filter(m => m !== newMarker);
    });

    markers.value.push(newMarker);
};

const saveMarkerText = () => {
    if (!editingMarker.value) return;

    const marker = markers.value.find(m => m.markerData.id === editingMarker.value.id);
    if (marker) {
        marker.markerData.text = editingMarker.value.text;
        marker.setPopupContent(createMarkerPopupContent(marker.markerData));
    }

    editingMarker.value = null;
};

const exportMarkers = () => {
    const markersData = markers.value.map(marker => marker.markerData);
    const dataStr = JSON.stringify(markersData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'map-markers.json');
    linkElement.click();
};

const importMarkers = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const markersData = JSON.parse(e.target.result);

            // Clear existing markers
            clearMarkers();

            // Add imported markers
            markersData.forEach(data => {
                const marker = leaflet.marker([data.lat, data.lng], {
                    draggable: true
                });

                marker.markerData = data;

                marker
                    .addTo(map.value)
                    .bindPopup(createMarkerPopupContent(data));

                marker.on('dragend', (event) => {
                    const m = event.target;
                    const position = m.getLatLng();
                    m.markerData.lat = position.lat;
                    m.markerData.lng = position.lng;
                    m.setPopupContent(createMarkerPopupContent(m.markerData));
                });

                marker.on('contextmenu', () => {
                    map.value.removeLayer(marker);
                    markers.value = markers.value.filter(m => m !== marker);
                });

                markers.value.push(marker);
            });
        } catch (error) {
            console.error('Error importing markers:', error);
            alert('Error importing markers. Please check the file format.');
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
};

onMounted(() => {
    // Инициализировать карту
    map.value = leaflet.map(mapContainer.value).setView([49.4444, 32.0598], 13);

    // Добавить слой OpenStreetMap
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map.value);

    // Обработчик клика для добавления новых маркеров пользователем
    map.value.on('click', addMarker);

    // Добавить все items как маркеры на карту
    if (props.items && props.items.length > 0) {
        addAllMarkers();
    }
});

watch(
    () => props.items,
    (newItems) => {
        if (map.value && newItems !== undefined) {
            clearMarkers();
            addAllMarkers();
        }
    },
    { immediate: true }
);

function clearMarkers() {
    if (map.value) {
        map.value.eachLayer(layer => {
            if (layer instanceof leaflet.Marker) {
                map.value.removeLayer(layer);
            }
        });
        markers.value = [];
    }
}

function addAllMarkers() {
    props.items.forEach(item => {
        const address = item.address;
        const position = address.markerPosition;

        if (!position || !Array.isArray(position) || position.length !== 2) return;

        const text = `${address.city.name}, ${address.region.name}: ${address.street}`;
        const description = `ціна: ${item.price} UAH
        площа: ${item.apartmentArea.totalArea} м²
        кімнат: ${item.rooms.all}`;
        const markerData = {
            lat: position[0],
            lng: position[1],
            text: text,
            description: description,
            id: Date.now(),
            item: item
        };

        const newMarker = leaflet.marker([position[0], position[1]], { draggable: true });
        newMarker.markerData = markerData;

        newMarker
            .addTo(map.value)
            .bindPopup(createMarkerPopupContent(markerData))
            .openPopup();

        newMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            marker.markerData.lat = position.lat;
            marker.markerData.lng = position.lng;
            marker.setPopupContent(createMarkerPopupContent(marker.markerData));
        });

        newMarker.on('contextmenu', () => {
            map.value.removeLayer(newMarker);
            markers.value = markers.value.filter(m => m !== newMarker);
        });

        markers.value.push(newMarker);
    });
}


</script>

<style scoped>
.map-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.controls {
    display: flex;
    gap: 10px;
    padding: 10px;
}

button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background: white;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

button.active {
    background: #4CAF50;
    color: white;
    border-color: #45a049;
}

button:hover:not(:disabled) {
    background: #f0f0f0;
}

button.active:hover {
    background: #45a049;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
}

.marker-text-input {
    width: 100%;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.marker-popup {
    min-width: 200px;
}

.popup-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    margin-top: 8px;
}

.edit-btn {
    padding: 4px 8px;
    font-size: 12px;
}
</style>
