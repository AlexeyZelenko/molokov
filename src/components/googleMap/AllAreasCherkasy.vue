<script setup lang="ts">
import { ref, computed } from "vue";
import { GoogleMap, Marker, Circle } from "vue3-google-map";
import { useAreasStore } from "@/stores/areasStore"; // Импортируем store

// Получаем данные через store
const areasStore = useAreasStore();
const areas = computed(() => areasStore.areas); // Получаем список всех районов из store
const selectedArea = computed(() => areasStore.selectedArea); // Получаем выбранный район из store

// Центр карты (по умолчанию)
const center = { lat: 49.4444, lng: 32.0594 };

// Состояние для выбранного района
const selectedAreaCode = ref("");

// Функция для выбора района
const selectArea = () => {
    if (selectedAreaCode.value) {
        areasStore.setSelectedArea(selectedAreaCode.value); // Обновляем выбранный район в store
    }
};

// Получаем ключ API из переменных окружения
const apiKey = ref(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"
);
</script>
