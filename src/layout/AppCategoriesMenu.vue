<template>
    <div class="layout-sidebar">
        <div class="flex flex-col">
            <div class="font-semibold text-xl mb-4">Фільтри</div>
            <div class="flex flex-col gap-3">
                <Accordion value="0">
                    <AccordionPanel>
                        <AccordionHeader class="font-semibold text-xl mb-4">Кількість кімнат</AccordionHeader>
                        <AccordionContent>
                            <div v-for="(rooms, key) in roomsAll" :key="key" class="flex flex-col">
                                <label>{{ rooms.name }}</label>
                                <Select
                                    v-model="filters[`rooms.${key}`]"
                                    :options="rooms.value.map(room => ({ name: room, value: room }))"
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder="Выберите количество"
                                    @change="applyFilters"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

                <div class="flex flex-col">
                    <label>Стан</label>
                    <Select
                        v-model="filters['condition.value']"
                        :options="conditions"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Вибрати стан"
                        @change="applyFilters"
                    />
                </div>

                <div class="flex flex-col">
                    <label>Тип опалення</label>
                    <Select
                        v-model="filters['heatingType.value']"
                        :options="heatingTypes"
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Вибрати тип опалення"
                        @change="applyFilters"
                    />
                </div>


                <!-- Фильтр по количеству комнат -->
                <div class="flex flex-col">
                    <label>Количество комнат</label>
                    <InputNumber v-model="filters.rooms" placeholder="Количество комнат" />
                </div>

                <!-- Фильтр по этажу -->
                <div class="flex flex-col">
                    <label>Этаж</label>
                    <InputNumber v-model="filters.floor" placeholder="Этаж" />
                </div>

                <!-- Фильтр по площади -->
                <div class="flex flex-col">
                    <label>Площадь</label>
                    <InputNumber v-model="filters.area" placeholder="Площадь" />
                </div>

                <div class="flex flex-col">
                    <label>Цена</label>
                    <div class="flex flex-col gap-1">
                        <InputNumber
                            v-model="filters.minPrice"
                            placeholder="Минимальная"
                            :min="0"
                            :max="filters.maxPrice"
                        />
                        <InputNumber
                            v-model="filters.maxPrice"
                            placeholder="Максимальная"
                            :min="filters.minPrice"
                        />
                    </div>
                </div>
            </div>
            <Button label="Застосувати фільтри" icon="pi pi-check" @click="setFilters" class="mt-4" />
            <Button label="Скинути фільтри" icon="pi pi-check" @click="clearFilters" class="mt-4" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import Select from "primevue/select";

const storeCategories = usePropertiesStore();

// Фильтры
const filters = ref({
    'condition.value': null,
    'rooms.all': null,
    'rooms.bedrooms': null,
    'rooms.bathrooms': null,
    'rooms.kitchens': null,
    heatingType: null,
    furniture: null,
    minPrice: null,
    maxPrice: null,
});

// Функция для установки фильтров
const setFilters = () => {
    const cleanedFilters = cleanFilters(filters.value);  // Очистка фильтров
    storeCategories.setFilters(cleanedFilters);  // Отправка очищенных фильтров в хранилище
};

// Функция для очистки фильтров от значений null или пустых строк
const cleanFilters = (filters) => {
    const cleanedFilters = {};
    for (const [key, value] of Object.entries(filters)) {
        if (value !== null && value !== '' && value !== undefined) {
            cleanedFilters[key] = value;
        }
    }
    return cleanedFilters;
};

// Функция для применения фильтров
const applyFilters = () => {
    const cleanedFilters = cleanFilters(filters.value);  // Очистка фильтров
    storeCategories.setFilters(cleanedFilters);  // Отправка очищенных фильтров в хранилище
};

const clearFilters = () => {
    filters.value = {};
    storeCategories.setFilters(filters.value);
};

const properties = computed(() => storeCategories.properties);

const conditions = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.condition))];
});

const heatingTypes = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.heatingType))];
});

const roomsAll = computed(() => {
    // Каждый объект будет содержать ключ 'name' (для отображения) и 'value' (для значений)
    const all = {
        name: 'Все комнаты',
        key: 'rooms.all',
        value: [...new Set(storeCategories.properties.map(property => property.rooms.all))]
    };
    const bathrooms = {
        name: 'Ванные комнаты',
        key: 'rooms.bathrooms',
        value: [...new Set(storeCategories.properties.map(property => property.rooms.bathrooms))]
    };
    const bedrooms = {
        name: 'Спальни',
        key: 'rooms.bedrooms',
        value: [...new Set(storeCategories.properties.map(property => property.rooms.bedrooms))]
    };
    const kitchens = {
        name: 'Кухни',
        key: 'rooms.kitchens',
        value: [...new Set(storeCategories.properties.map(property => property.rooms.kitchens))]
    };

    // Возвращаем объект с каждым набором данных
    return { all, bathrooms, bedrooms, kitchens };
});



onMounted(() => {
    console.log('properties', properties.value);
});

</script>
