<template>
    <div class="flex flex-col">
        <div class="sticky top-0 z-10 py-4">
            <div class="flex justify-between font-semibold text-xl">
                Фільтри
                <Button icon="pi pi-times" severity="help" rounded variant="outlined" aria-label="Cancel" @click="handleClose"/>
            </div>
        </div>
        <div class="flex flex-col gap-3 overflow-y-auto p-4">

            <div class="flex flex-col">
                <Button
                    @click="clearFilters"
                    type="button"
                    label="Скинути"
                    :icon="countFilterParams ? 'pi pi-filter' : 'pi pi-filter-slash'"
                    :badge="countFilterParams"
                    badgeSeverity="contrast"
                    variant="outlined"
                />
                <Button
                    :label="allPanelsOpen ? 'Закрити всі фільтри' : 'Відкрити всі фільтри'"
                    @click="toggleAllPanels"
                    class="mt-2"
                    variant="outlined"
                />
            </div>

            <Accordion v-model:value="activePanels" :multiple="true">
                <AccordionPanel value="selectedFilters">
                    <AccordionHeader class="font-semibold text-xl mb-4">
                        Вибрані фільтри
                        <OverlayBadge v-if="countFilterParams" :value="countFilterParams">
                            <i
                                :class="countFilterParams ? 'pi pi-filter' : 'pi pi-filter-slash'"
                                style="font-size: 1.5rem"
                            />
                        </OverlayBadge>
                        <i
                            v-else
                            class="pi pi-filter-slash"
                            style="font-size: 1.5rem"
                        />
                    </AccordionHeader>
                    <AccordionContent>
                        <div
                            v-for="filter in getSelectedFilters"
                            :key="filter.key"
                            class="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mt-2"
                        >
                            <p class="font-light text-sm">{{ filter.displayName }}: {{ filter.value }}</p>
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="location">
                    <AccordionHeader class="font-semibold text-xl mb-4">Росташування</AccordionHeader>
                    <AccordionContent>
                        <div v-for="(item, key) in address" :key="key" class="flex flex-col">
                            <label>{{ item.name }}</label>
                            <Select
                                v-model="filters[`address.${key}.code`]"
                                :options="item.value.map(i => ({ name: i.name, value: i.code }))"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="rooms">
                    <AccordionHeader class="font-semibold text-xl mb-4">Кількість кімнат</AccordionHeader>
                    <AccordionContent>
                        <div v-for="(rooms, key) in roomsAll" :key="key" class="flex flex-col">
                            <label>{{ rooms.name }}</label>
                            <Select
                                v-model="filters[`rooms.${key}`]"
                                :options="rooms.value.map(room => ({ name: room, value: room }))"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="area">
                    <AccordionHeader>Площа</AccordionHeader>
                    <AccordionContent>
                        <!-- Фильтр по площади -->
                        <div class="flex flex-col">
                            <label>Площа (загальна)</label>
                            <div class="flex flex-col gap-1">
                                <InputNumber
                                    v-model="filters.minArea"
                                    placeholder="Мінімальна"
                                    :min="0"
                                    :max="filters.maxArea"
                                />
                                <InputNumber
                                    v-model="filters.maxArea"
                                    placeholder="Максимальна"
                                    :min="filters.minArea"
                                />
                            </div>
                        </div>

                        <!-- Фильтр по площади -->
                        <div class="flex flex-col">
                            <label>Площа (житлова)</label>
                            <div class="flex flex-col gap-1">
                                <InputNumber
                                    v-model="filters.minAreaLiving"
                                    placeholder="Мінімальна"
                                    :min="0"
                                    :max="filters.maxAreaLiving"
                                />
                                <InputNumber
                                    v-model="filters.maxAreaLiving"
                                    placeholder="Максимальна"
                                    :min="filters.minAreaLiving"
                                />
                            </div>
                        </div>

                        <!-- Фильтр по площади кухні-->
                        <div class="flex flex-col">
                            <label>Площа (кухні)</label>
                            <div class="flex flex-col gap-1">
                                <InputNumber
                                    v-model="filters.minAreaKitchen"
                                    placeholder="Мінімальна"
                                    :min="0"
                                    :max="filters.maxAreaKitchen"
                                />
                                <InputNumber
                                    v-model="filters.maxAreaKitchen"
                                    placeholder="Максимальна"
                                    :min="filters.minAreaKitchen"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="building">
                    <AccordionHeader>Інфо про будинок</AccordionHeader>
                    <AccordionContent>
                        <div class="flex flex-col">
                            <label>Стан будинку</label>
                            <Select
                                v-model="filters['condition.value']"
                                :options="condition"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>

                        <div class="flex flex-col">
                            <label>Клас будинку</label>
                            <Select
                                v-model="filters['objectClass.value']"
                                :options="objectClass"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>

                        <div class="flex flex-col">
                            <label>Тип будинку</label>
                            <Select
                                v-model="filters['buildingType.value']"
                                :options="buildingType"
                                optionLabel="name"
                                optionValue="value"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>
                    </AccordionContent>
                </AccordionPanel>

                <AccordionPanel value="details">
                    <AccordionHeader>Детальніше про об'єкт</AccordionHeader>
                    <AccordionContent>
                        <div class="flex flex-col">
                            <label>Стан об'єкта</label>
                            <Select
                                v-model="filters['reconditioning.value']"
                                :options="reconditioning"
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

                        <div class="flex flex-col">
                            <label>Паркінг</label>
                            <Select
                                v-model="filters['parking.code']"
                                :options="parking"
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>

                        <div class="flex flex-col">
                            <label>Поверх</label>
                            <div class="flex flex-col gap-1">
                                <InputNumber
                                    v-model="filters.minFloor"
                                    placeholder="Мінімальна"
                                    :min="0"
                                    :max="filters.maxFloor"
                                />
                                <InputNumber
                                    v-model="filters.maxFloor"
                                    placeholder="Максимальна"
                                    :min="filters.minFloor"
                                />
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <label>Балкон / Тераса</label>
                            <Select
                                v-model="filters['balconyTerrace.code']"
                                :options="balconyTerrace"
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>

                        <div class="flex flex-col">
                            <label>Меблі</label>
                            <Select
                                v-model="filters['furniture.code']"
                                :options="furniture"
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Вибрати"
                                @change="applyFilters"
                            />
                        </div>
                        <Accordion value="0">
                            <AccordionPanel>
                                <AccordionHeader class="font-semibold text-xl mb-4">Комунальні послуги</AccordionHeader>
                                <AccordionContent>
                                    <div v-for="(item, key) in utilities" :key="key" class="flex justify-between my-2 gap-2">
                                        <label class="text-sm font-medium">{{ item.name }}</label>
                                        <ToggleSwitch
                                            v-model="filters[`utilities.${key}.code`]"
                                            :trueValue="`${item.code}`"
                                            :falseValue="null"
                                            @change="applyFilters"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionPanel>
                        </Accordion>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

            <div class="flex flex-col">
                <label>Ціна</label>
                <div class="flex flex-col gap-1">
                    <InputNumber
                        v-model="filters.minPrice"
                        placeholder="Мінімальна"
                        :min="0"
                        :max="filters.maxPrice"
                    />
                    <InputNumber
                        v-model="filters.maxPrice"
                        placeholder="Максимальна"
                        :min="filters.minPrice"
                    />
                </div>
            </div>
        </div>
        <Button label="Застосувати фільтри" icon="pi pi-check" @click="setFilters" class="mt-4" />
        <Button label="Скинути фільтри" icon="pi pi-check" @click="clearFilters" class="mt-4" />
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';
import Select from "primevue/select";
import ToggleSwitch from 'primevue/toggleswitch';

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
    'objectClass.value': null,
    'parking.value': null,
    'reconditioning.value': null,
    'balconyTerrace.code': null,
    'furniture.code': null
});

// Состояние для управления открытием/закрытием всех панелей
const allPanelsOpen = ref(false);
// Значения всех панелей
const panelValues = ['location', 'rooms', 'area', 'building', 'details'];
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

const countFilterParams = computed(() => {
    return Object.keys(filters.value).filter(key => filters.value[key] !== null).length;
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

const getUniqueValues = (propertyKey) => computed(() =>
    [...new Map(
        storeCategories.properties
            .map(property => property[propertyKey]) // Извлекаем значения по ключу
            .filter(value => value !== null && value !== undefined) // Исключаем null и undefined
            .map(item => [item.name + item.value, item]) // Создаем уникальный ключ на основе name и value
    ).values()]
);

// Используем универсальную функцию для создания вычисляемых свойств
const furniture = getUniqueValues('furniture');
const buildingType = getUniqueValues('buildingType');
const condition = getUniqueValues('condition');
const objectClass = getUniqueValues('objectClass');
const parking = getUniqueValues('parking');
const balconyTerrace = getUniqueValues('balconyTerrace');
const heatingTypes = getUniqueValues('heatingType');
const reconditioning = getUniqueValues('reconditioning');

const roomsAll = computed(() => {
    // Функция для обработки и исключения дубликатов
    const processRoomsField = (field) => {
        const values = storeCategories.properties
            .map(property => property.rooms[field])
            .filter(value => value !== null && value !== undefined); // Исключаем пустые значения

        // Убираем дубликаты
        const uniqueValues = [...new Set(values)];

        // Сортировка значений
        return uniqueValues.sort((a, b) => a - b); // Для числовых значений сортировка по возрастанию
    };

    const all = {
        name: 'Всього кімнат',
        key: 'rooms.all',
        value: processRoomsField('all')
    };

    const bathrooms = {
        name: 'Санвузли',
        key: 'rooms.bathrooms',
        value: processRoomsField('bathrooms')
    };

    const bedrooms = {
        name: 'Спальні',
        key: 'rooms.bedrooms',
        value: processRoomsField('bedrooms')
    };

    const kitchens = {
        name: 'Кухні',
        key: 'rooms.kitchens',
        value: processRoomsField('kitchens')
    };

    return { all, bathrooms, bedrooms, kitchens };
});

const address = computed(() => {
    const processAddressField = (field) => {
        const values = storeCategories.properties
            .filter(property => property.address && property.address[field])
            .map(property => property.address[field])
            .flat()
            .filter(value => value !== null && value !== '' && value !== undefined);

        const uniqueValues = [];
        values.forEach(value => {
            if (value && value.code && !uniqueValues.some(item => item.code === value.code)) {
                uniqueValues.push(value);
            }
        });

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

const utilities = computed(() => {
    const processUtilityField = (field) => {
        const values = storeCategories.properties
            .filter(property => property.utilities && property.utilities[field])
            .map(property => property.utilities[field])
            .filter(value => value !== null && value !== undefined);

        const uniqueValues = [];
        values.forEach(value => {
            if (value && value.code && !uniqueValues.some(item => item.code === value.code)) {
                uniqueValues.push(value);
            }
        });

        return uniqueValues.sort((a, b) => {
            if (!a.name || !b.name) return 0;
            return a.name.localeCompare(b.name);
        });
    };

    const electricity = {
        name: 'Електрика',
        key: 'electricity',
        code: 'ELEC',
        value: processUtilityField('electricity')
    };

    const water = {
        name: 'Вода',
        key: 'water',
        code: 'WTR',
        value: processUtilityField('water')
    };

    const sewerage = {
        name: 'Каналізація',
        key: 'sewerage',
        code: 'SWR',
        value: processUtilityField('sewerage')
    };

    const gas = {
        name: 'Газ',
        key: 'gas',
        code: 'GAS',
        value: processUtilityField('gas')
    };

    const heating = {
        name: 'Опалення',
        key: 'heating',
        code: 'HTG',
        value: processUtilityField('heating')
    };

    const internet = {
        name: 'Інтернет',
        key: 'internet',
        code: 'INT',
        value: processUtilityField('internet')
    };

    const TV = {
        name: 'Телебачення',
        key: 'TV',
        code: 'TV',
        value: processUtilityField('TV')
    };

    return { electricity, water, sewerage, gas, heating, internet, TV };
});

const getSelectedFilters = computed(() => {
    const selectedFilters = [];

    for (const [key, value] of Object.entries(filters.value)) {
        if (value !== null && value !== undefined && value !== '') {
            const parts = key.split('.');
            let displayName = '';
            let displayValue = value;
            console.log(parts);

            // Handle different filter types
            if (parts[0] === 'rooms') {
                const roomType = roomsAll.value[parts[1]];
                displayName = roomType.name;
            } else if (parts[0] === 'address') {
                const addressType = address.value[parts[1]];
                displayName = addressType.name;
                const addressItem = addressType.value.find(item => item.code === value);
                if (addressItem) {
                    displayValue = addressItem.name;
                }
            } else if (parts[0] === 'utilities') {
                const utilityType = utilities.value[parts[1]];
                displayName = utilityType.name;
                const utilityItem = utilityType.value.find(item => item.code === value);
                if (utilityItem) {
                    displayValue = utilityItem.name;
                }
            } else if (parts[0] === 'condition' && parts[1] === 'value') {
                displayName = 'Стан будинку';
                const conditionItem = condition.value.find(item => item.value === value);
                console.log(conditionItem);
                if (conditionItem) {
                    displayValue = conditionItem.name;
                }
            } else if (parts[0] === 'reconditioning' && parts[1] === 'value') {
                displayName = 'Ремонт';
                const reconditioningItem = reconditioning.value.find(item => item.value === value);
                if (reconditioningItem) {
                    displayValue = reconditioningItem.name;
                }
            } else if (parts[0] === 'balconyTerrace' && parts[1] === 'code') {
                displayName = 'Балкон/Тераса';
                const balconyItem = balconyTerrace.value.find(item => item.code === value);
                if (balconyItem) {
                    displayValue = balconyItem.name;
                }
            } else if (parts[0] === 'heatingType' && parts[1] === 'value') {
                displayName = 'Тип опалення';
                const heatingItem = heatingTypes.value.find(item => item.value === value);
                if (heatingItem) {
                    displayValue = heatingItem.name;
                }
            } else if (parts[0] === 'objectClass' && parts[1] === 'value') {
                displayName = 'Клас';
                const classItem = objectClass.value.find(item => item.value === value);
                if (classItem) {
                    displayValue = classItem.name;
                }
            } else if (parts[0] === 'buildingType' && parts[1] === 'value') {
                displayName = 'Тип будинку';
                const classItem = buildingType.value.find(item => item.value === value);
                if (classItem) {
                    displayValue = classItem.name;
                }
            } else if (parts[0] === 'parking' && parts[1] === 'code') {
                displayName = 'Паркінг';
                const parkingItem = parking.value.find(item => item.code === value);
                if (parkingItem) {
                    displayValue = parkingItem.name;
                }
            } else if (parts[0] === 'furniture' && parts[1] === 'code') {
                displayName = 'Меблі';
                const furnitureItem = furniture.value.find(item => item.code === value);
                if (furnitureItem) {
                    displayValue = furnitureItem.name;
                }
            } else {
            // Handle other filter types
            switch (key) {
                    case 'minPrice':
                        displayName = 'Мін. ціна';
                        break;
                    case 'maxPrice':
                        displayName = 'Макс. ціна';
                        break;
                    case 'minArea':
                        displayName = 'Мін. площа';
                        displayValue = `${value} м²`;
                        break;
                    case 'maxArea':
                        displayName = 'Макс. площа';
                        displayValue = `${value} м²`;
                        break;
                    case 'minAreaLiving':
                        displayName = 'Мін. житлова площа';
                        displayValue = `${value} м²`;
                        break;
                    case 'maxAreaLiving':
                        displayName = 'Макс. житлова площа';
                        displayValue = `${value} м²`;
                        break;
                    case 'minAreaKitchen':
                        displayName = 'Мін. площа кухні';
                        displayValue = `${value} м²`;
                        break;
                    case 'maxAreaKitchen':
                        displayName = 'Макс. площа кухні';
                        displayValue = `${value} м²`;
                        break;
                    case 'minFloor':
                        displayName = 'Мін. поверх';
                        break;
                    case 'maxFloor':
                        displayName = 'Макс. поверх';
                        break;
                    default:
                        const computedProps = {
                            furniture
                        };

                        for (const [propName, prop] of Object.entries(computedProps)) {
                            if (key.includes(propName)) {
                                displayName = value.name || propName;
                                displayValue = value.value || value;
                                break;
                            }
                        }
                }
            }

            selectedFilters.push({
                key,
                displayName: displayName || key,
                value: displayValue
            });
        }
    }

    return selectedFilters;
});

</script>

<style scoped>
.sticky {
    position: sticky;
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #e5e7eb;
}
</style>
