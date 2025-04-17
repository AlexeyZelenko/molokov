<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import Select from 'primevue/select';
import { useAreasStore } from '@/store/areasStore';

const storeCategories = usePropertiesStore();
const storeAreasStore = useAreasStore();

// Фильтры
const filters = ref({
    'condition.value': null,
    'rooms.all': null,
    'floors.totalFloors': null,
    minPrice: null,
    maxPrice: null,
    maxFloor: null,
    minFloor: null,
    minArea: null,
    maxArea: null,
    maxAreaLiving: null,
    minAreaLiving: null,
    minAreaKitchen: null,
    maxAreaKitchen: null,
    'address.area.code': null,
    'address.city.code': null,
    'address.region.code': null,
    'buildingType.value': null,
    'objectClass.value': null
});
const selectedSort = ref('relevance');

// Состояние для управления открытием/закрытием всех панелей
const allPanelsOpen = ref(false);
// Значения всех панелей
const panelValues = ['location', 'rooms', 'area', 'building', 'details', 'building-floors'];
// Активные панели
const activePanels = ref([]);

// Функция для переключения состояния всех панелей
const toggleAllPanels = () => {
    allPanelsOpen.value = !allPanelsOpen.value;
    activePanels.value = allPanelsOpen.value ? [...panelValues] : [];
};

const emit = defineEmits(['closeFilters']);
const handleClose = () => {
    emit('closeFilters');
};

const filteredCities = computed(() => {
    if (!filters.value['address.region.code']) {
        return address.value.city.value;
    }

    return storeCategories.properties
        .filter((property) => property.address?.region?.code === filters.value['address.region.code'])
        .map((property) => property.address?.city)
        .filter((city) => city)
        .reduce((unique, city) => {
            if (!unique.some((item) => item.code === city.code)) {
                unique.push(city);
            }
            return unique;
        }, [])
        .sort((a, b) => a.name.localeCompare(b.name));
});

watch(
    () => filters.value['address.region.code'],
    (newVal) => {
        if (newVal) {
            filters.value['address.city.code'] = null;
            filters.value['address.area.code'] = null;
        }
    }
);

watch(
    () => filters.value['address.city.code'],
    (newVal) => {
        if (!newVal) {
            filters.value['address.area.code'] = null;
        }
    }
);

const countFilterParams = computed(() => {
    const count = Object.keys(filters.value).filter((key) => {
        const value = filters.value[key];
        return value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
    }).length;

    return count > 0 ? String(count) : null;
});

// Функция для установки фильтров
const setFilters = () => {
    console.log('setFilters', filters.value);    
    const cleanedFilters = cleanFilters(filters.value);
    storeCategories.setFilters(cleanedFilters);
};

// Функция для очистки фильтров от значений null или пустых строк
const cleanFilters = (filters) => {
    const cleanedFilters = {};
    for (const [key, value] of Object.entries(filters)) {
        if (value !== null && value !== '' && value !== undefined && !(Array.isArray(value) && value.length === 0)) {
            cleanedFilters[key] = value;
        }
    }
    return cleanedFilters;
};

const clearFilters = () => {
    filters.value = {
        'condition.value': null,
        'rooms.all': null,
        'floors.totalFloors': null,
        minPrice: null,
        maxPrice: null,
        maxFloor: null,
        minFloor: null,
        minArea: null,
        maxArea: null,
        maxAreaLiving: null,
        minAreaLiving: null,
        minAreaKitchen: null,
        maxAreaKitchen: null,
        'address.area.code': null,
        'address.city.code': null,
        'address.region.code': null,
        'buildingType.value': null,
        'objectClass.value': null
    };
    storeCategories.setFilters({});
};

// Применение фильтров
const applyFilters = () => {
    const cleanedFilters = cleanFilters(filters.value);
    if (cleanedFilters['rooms.all']?.length === 0) {
        delete cleanedFilters['rooms.all'];
    }
    storeCategories.setFilters(cleanedFilters);
};

const getUniqueValues = (propertyKey) =>
    computed(() => [
        ...new Map(
            storeCategories.properties
                .map((property) => property[propertyKey])
                .filter((value) => value !== null && value !== undefined)
                .map((item) => [item.name + item.value, item])
        ).values()
    ]);

// Используем универсальную функцию для создания вычисляемых свойств
const buildingType = getUniqueValues('buildingType');
const condition = getUniqueValues('condition');
const objectClass = getUniqueValues('objectClass');
const reconditioning = getUniqueValues('reconditioning');

const buildingFloors = computed(() => {
    const values = storeCategories.properties.map((property) => property.floors?.totalFloors).filter((value) => value !== null && value !== undefined);
    const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

    return {
        name: 'Етажність будівлі',
        key: 'floors.totalFloors',
        value: uniqueValues
    };
});

const roomsAll = computed(() => {
    const processRoomsField = (field) => {
        const values = storeCategories.properties.map((property) => property.rooms[field]).filter((value) => value !== null && value !== undefined);
        const uniqueValues = [...new Set(values)];
        return uniqueValues.sort((a, b) => a - b);
    };

    const all = {
        name: 'Всього кімнат',
        key: 'rooms.all',
        value: processRoomsField('all')
    };

    return { all };
});

const address = computed(() => {
    const processAddressField = (field) => {
        let filteredProperties = storeCategories.properties;

        if (field === 'area' && filters.value['address.city.code']) {
            filteredProperties = filteredProperties.filter((property) => property.address?.city?.code === filters.value['address.city.code']);
        }

        if (field === 'city' && filters.value['address.region.code']) {
            filteredProperties = filteredProperties.filter((property) => property.address?.region?.code === filters.value['address.region.code']);
        }

        const values = filteredProperties
            .filter((property) => property.address && property.address[field])
            .map((property) => property.address[field])
            .flat()
            .filter((value) => value !== null && value !== '' && value !== undefined);

        const uniqueValuesMap = new Map();
        values.forEach((value) => {
            if (value && value.code) {
                if (!uniqueValuesMap.has(value.code)) {
                    uniqueValuesMap.set(value.code, value);
                }
            }
        });

        const uniqueValues = Array.from(uniqueValuesMap.values());

        return uniqueValues.sort((a, b) => {
            if (!a.name || !b.name) return 0;
            return a.name.localeCompare(b.name);
        });
    };

    const region = {
        name: 'Регіон',
        key: 'region',
        value: processAddressField('region')
    };

    const city = {
        name: 'Місто',
        key: 'city',
        value: processAddressField('city')
    };

    const area = {
        name: 'Район',
        key: 'area',
        value: processAddressField('area')
    };

    return { region, city, area };
});

const getSelectedFilters = computed(() => {
    const filterTypeMap = {
        rooms: (key, value, parts) => ({
            displayName: roomsAll.value[parts[1]].name,
            displayValue: value
        }),
        floors: (key, value) => ({
            displayName: 'Етажність будівлі',
            displayValue: value
        }),
        address: (key, value, parts) => {
            const addressType = address.value[parts[1]];
            const addressItem = addressType.value.find((item) => item.code === value);
            return {
                displayName: addressType.name,
                displayValue: addressItem?.name || value
            };
        },
        condition: (key, value) => ({
            displayName: 'Стан будинку',
            displayValue: condition.value.find((item) => item.value === value)?.name || value
        }),
        reconditioning: (key, value) => ({
            displayName: 'Ремонт',
            displayValue: reconditioning.value.find((item) => item.value === value)?.name || value
        }),
        objectClass: (key, value) => ({
            displayName: 'Клас',
            displayValue: objectClass.value.find((item) => item.value === value)?.name || value
        }),
        buildingType: (key, value) => ({
            displayName: 'Тип будинку',
            displayValue: buildingType.value.find((item) => item.value === value)?.name || value
        })
    };

    const simpleFilterMap = {
        minPrice: 'Мін. ціна',
        maxPrice: 'Макс. ціна',
        minArea: { name: 'Мін. площа', unit: 'м²' },
        maxArea: { name: 'Макс. площа', unit: 'м²' },
        minAreaLiving: { name: 'Мін. житлова площа', unit: 'м²' },
        maxAreaLiving: { name: 'Макс. житлова площа', unit: 'м²' },
        minAreaKitchen: { name: 'Мін. площа кухні', unit: 'м²' },
        maxAreaKitchen: { name: 'Макс. площа кухні', unit: 'м²' },
        minFloor: 'Мін. поверх',
        maxFloor: 'Макс. поверх'
    };

    return Object.entries(filters.value)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0))
        .map(([key, value]) => {
            const parts = key.split('.');
            const filterType = parts[0];

            if (filterTypeMap[filterType]) {
                const { displayName, displayValue } = filterTypeMap[filterType](key, value, parts);
                return { key, displayName, value: displayValue };
            }

            if (simpleFilterMap[key]) {
                const filterInfo = simpleFilterMap[key];
                const displayName = typeof filterInfo === 'string' ? filterInfo : filterInfo.name;
                const displayValue = filterInfo.unit ? `${value} ${filterInfo.unit}` : value;
                return { key, displayName, value: displayValue };
            }

            return {
                key,
                displayName: key,
                value: value
            };
        });
});

onMounted(async () => {
    filters.value = { ...storeAreasStore.getFilters };
    await nextTick();
    setFilters();
});
</script>

<template>
    <Tabs value="0">
        <TabList>
            <Tab value="0">
                <div class="flex justify-between font-semibold text-xl">Фільтри</div>
            </Tab>
            <Tab value="1">
                <div class="flex justify-between font-semibold text-xl">Сортувати</div>
            </Tab>
            <Button icon="pi pi-times" severity="help" rounded variant="outlined" aria-label="Cancel" @click="handleClose" />
        </TabList>
        <TabPanels>
            <TabPanel value="0">
                <div class="flex flex-col gap-3 overflow-y-auto">
                    <div class="flex flex-col">
                        <Button @click="clearFilters" type="button" label="Скинути" :icon="countFilterParams ? 'pi pi-filter' : 'pi pi-filter-slash'" :badge="countFilterParams" badgeSeverity="contrast" variant="outlined" />
                        <Button :label="allPanelsOpen ? 'Закрити всі фільтри' : 'Відкрити всі фільтри'" @click="toggleAllPanels" class="mt-2" variant="outlined" />
                    </div>

                    <Accordion v-model:value="activePanels" :multiple="true">
                        <AccordionPanel value="selectedFilters">
                            <AccordionHeader class="font-semibold text-xl mb-4">
                                Вибрані фільтри
                                <OverlayBadge v-if="countFilterParams" :value="countFilterParams">
                                    <i :class="countFilterParams ? 'pi pi-filter' : 'pi pi-filter-slash'" style="font-size: 1.5rem" />
                                </OverlayBadge>
                                <i v-else class="pi pi-filter-slash" style="font-size: 1.5rem" />
                            </AccordionHeader>
                            <AccordionContent>
                                <div v-for="filter in getSelectedFilters" :key="filter.key" class="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mt-2">
                                    <p class="font-light text-sm">{{ filter.displayName }}: {{ filter.value }}</p>
                                </div>
                            </AccordionContent>
                        </AccordionPanel>

                        <AccordionPanel value="location">
                            <AccordionHeader class="font-semibold text-xl mb-4">Росташування</AccordionHeader>
                            <AccordionContent>
                                <div class="flex flex-col">
                                    <label>Область</label>
                                    <Select v-model="filters['address.region.code']" :options="address.region.value.map((i) => ({ name: i.name, value: i.code }))" optionLabel="name" optionValue="value" placeholder="Вибрати" @change="applyFilters" />
                                </div>

                                <div class="flex flex-col mt-2">
                                    <label>Місто</label>
                                    <Select
                                        v-model="filters['address.city.code']"
                                        :options="filteredCities.map((i) => ({ name: i.name, value: i.code }))"
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Вибрати"
                                        :disabled="!filters['address.region.code']"
                                        @change="applyFilters"
                                    />
                                </div>

                                <div v-if="filters['address.city.code'] && address.area.value.length > 0" class="flex flex-col mt-2">
                                    <label>Район</label>
                                    <Select
                                        v-model="filters['address.area.code']"
                                        :options="address.area.value.map((i) => ({ name: i.name, value: i.code }))"
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Вибрати"
                                        :disabled="!filters['address.city.code']"
                                        @change="applyFilters"
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionPanel>

                        <AccordionPanel value="rooms">
                            <AccordionHeader class="font-semibold text-xl mb-4">Кількість кімнат</AccordionHeader>
                            <AccordionContent>
                                <div v-for="(rooms, key) in roomsAll" :key="key" class="flex flex-col">
                                    <MultiSelect
                                        v-model="filters['rooms.all']"
                                        :options="rooms.value.map((room) => ({ name: String(room), value: room }))"
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Вибрати"
                                        display="chip"
                                        @change="applyFilters"
                                        class="w-full"
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionPanel>

                        <AccordionPanel value="area">
                            <AccordionHeader>Площа</AccordionHeader>
                            <AccordionContent>
                                <div class="flex flex-col">
                                    <label>Площа (загальна)</label>
                                    <div class="flex flex-col gap-1">
                                        <InputNumber v-model="filters.minArea" placeholder="Мінімальна" :min="0" :max="filters.maxArea" />
                                        <InputNumber v-model="filters.maxArea" placeholder="Максимальна" :min="filters.minArea" />
                                    </div>
                                </div>

                                <div class="flex flex-col">
                                    <label>Площа (житлова)</label>
                                    <div class="flex flex-col gap-1">
                                        <InputNumber v-model="filters.minAreaLiving" placeholder="Мінімальна" :min="0" :max="filters.maxAreaLiving" />
                                        <InputNumber v-model="filters.maxAreaLiving" placeholder="Максимальна" :min="filters.minAreaLiving" />
                                    </div>
                                </div>

                                <div class="flex flex-col">
                                    <label>Площа (кухні)</label>
                                    <div class="flex flex-col gap-1">
                                        <InputNumber v-model="filters.minAreaKitchen" placeholder="Мінімальна" :min="0" :max="filters.maxAreaKitchen" />
                                        <InputNumber v-model="filters.maxAreaKitchen" placeholder="Максимальна" :min="filters.minAreaKitchen" />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionPanel>

                        <AccordionPanel value="building">
                            <AccordionHeader>Інфо про будинок</AccordionHeader>
                            <AccordionContent>
                                <div class="flex flex-col">
                                    <label>Стан будинку</label>
                                    <Select v-model="filters['condition.value']" :options="condition" optionLabel="name" optionValue="value" placeholder="Вибрати" @change="applyFilters" />
                                </div>

                                <div class="flex flex-col">
                                    <label>Клас будинку</label>
                                    <Select v-model="filters['objectClass.value']" :options="objectClass" optionLabel="name" optionValue="value" placeholder="Вибрати" @change="applyFilters" />
                                </div>

                                <div class="flex flex-col">
                                    <label>Тип будинку</label>
                                    <Select v-model="filters['buildingType.value']" :options="buildingType" optionLabel="name" optionValue="value" placeholder="Вибрати" @change="applyFilters" />
                                </div>
                            </AccordionContent>
                        </AccordionPanel>

                        <AccordionPanel value="details">
                            <AccordionHeader>Детальніше про об'єкт</AccordionHeader>
                            <AccordionContent>
                                <div class="flex flex-col">
                                    <label>Стан об'єкта</label>
                                    <Select v-model="filters['reconditioning.value']" :options="reconditioning" optionLabel="name" optionValue="value" placeholder="Вибрати" @change="applyFilters" />
                                </div>

                                <div class="flex flex-col mt-1">
                                    <label>Етажність будівлі</label>
                                    <MultiSelect
                                        v-model="filters['floors.totalFloors']"
                                        :options="buildingFloors.value.map((floor) => ({ name: String(floor), value: floor }))"
                                        optionLabel="name"
                                        optionValue="value"
                                        placeholder="Вибрати"
                                        display="chip"
                                        @change="applyFilters"
                                        class="w-full"
                                    />
                                </div>

                                <div class="flex flex-col mt-1">
                                    <label>Поверх</label>
                                    <div class="flex flex-col gap-1">
                                        <InputNumber v-model="filters.minFloor" placeholder="Мінімальна" :min="0" :max="filters.maxFloor" />
                                        <InputNumber v-model="filters.maxFloor" placeholder="Максимальна" :min="filters.minFloor" />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionPanel>
                    </Accordion>

                    <div class="flex flex-col">
                        <label>Ціна</label>
                        <div class="flex flex-col gap-1">
                            <InputNumber v-model="filters.minPrice" placeholder="Мінімальна" :min="0" :max="filters.maxPrice" />
                            <InputNumber v-model="filters.maxPrice" placeholder="Максимальна" :min="filters.minPrice" />
                        </div>
                    </div>
                </div>
                <Button label="Застосувати фільтри" icon="pi pi-check" @click="setFilters" class="mt-4" />
                <Button label="Скинути фільтри" icon="pi pi-check" @click="clearFilters" class="mt-4" />
            </TabPanel>
            <TabPanel value="1">
                <div class="flex flex-col gap-4">
                    <h3 class="font-semibold text-lg">Сортувати за:</h3>

                    <div class="flex flex-col gap-2">
                        <label class="font-medium">Ціна</label>
                        <div class="flex gap-2">
                            <Button
                                label="Від найнижчої"
                                :severity="selectedSort === 'price_asc' ? 'primary' : 'secondary'"
                                @click="
                                    selectedSort = 'price_asc';
                                    storeCategories.setSelectedSort(selectedSort);
                                "
                            />
                            <Button
                                label="Від найвищої"
                                :severity="selectedSort === 'price_desc' ? 'primary' : 'secondary'"
                                @click="
                                    selectedSort = 'price_desc';
                                    storeCategories.setSelectedSort(selectedSort);
                                "
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="font-medium">Площа</label>
                        <div class="flex gap-2">
                            <Button
                                label="Від найменшої"
                                :severity="selectedSort === 'area_asc' ? 'primary' : 'secondary'"
                                @click="
                                    selectedSort = 'area_asc';
                                    storeCategories.setSelectedSort(selectedSort);
                                "
                            />
                            <Button
                                label="Від найбільшої"
                                :severity="selectedSort === 'area_desc' ? 'primary' : 'secondary'"
                                @click="
                                    selectedSort = 'area_desc';
                                    storeCategories.setSelectedSort(selectedSort);
                                "
                            />
                        </div>
                    </div>

                    <Button
                        label="Скинути сортування"
                        icon="pi pi-refresh"
                        severity="help"
                        @click="
                            selectedSort = 'relevance';
                            storeCategories.setSelectedSort(selectedSort);
                        "
                        class="mt-2"
                    />
                </div>
            </TabPanel>
        </TabPanels>
    </Tabs>
</template>
