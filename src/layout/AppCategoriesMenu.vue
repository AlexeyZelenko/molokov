<template>
    <div>
        <div class="flex flex-col">
            <div class="flex justify-between font-semibold text-xl mb-4">
                <div>Фільтри</div>
                <Button icon="pi pi-times" severity="help" rounded variant="outlined" aria-label="Cancel" @click="handleClose"/>
            </div>
            <div class="flex flex-col gap-3">

                <Accordion value="0">
                    <AccordionPanel>
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
                </Accordion>

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
                                    placeholder="Вибрати"
                                    @change="applyFilters"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

                <Accordion value="0">
                    <AccordionPanel value="0">
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
                </Accordion>

                <Accordion value="0">
                    <AccordionPanel value="0">
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
                </Accordion>

                <Accordion value="0">
                    <AccordionPanel value="0">
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

const emit = defineEmits(['closeFilters']);
const handleClose = () => {
    emit('closeFilters');
};

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

const reconditioning = computed(() => {
    // Если 'property.reconditioning' является объектом, сравниваем по нужному ключу
    const reconditioningValues = storeCategories.properties
        .map(property => property.reconditioning)
        .filter(value => value !== null && value !== undefined);

    // Убираем дубликаты с учетом того, что reconditioning может быть объектом
    const uniqueReconditioning = reconditioningValues.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.name === value.name && t.value === value.value // Сравниваем объекты по полям
            ))
    );

    return uniqueReconditioning;
});


const heatingTypes = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.heatingType))];
});

const balconyTerrace = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.balconyTerrace))];
});

const furniture = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.furniture))];
});

const buildingType = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.buildingType))];
});

const condition = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.condition))];
});

const objectClass = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.objectClass))];
});

const parking = computed(() => {
    return [...new Set(storeCategories.properties.map(property => property.parking))];
});

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
    // Общая функция для обработки и исключения дубликатов на основе уникального поля
    const processAddressField = (field) => {
        const values = storeCategories.properties
            .map(property => property.address[field])
            .flat() // Разворачиваем массив, чтобы работать с отдельными объектами
            .filter(value => value !== null && value !== '' && value !== undefined); // Исключаем пустые значения

        // Убираем дубли по 'code' в каждом объекте
        const uniqueValues = [];
        values.forEach(value => {
            if (!uniqueValues.some(item => item.code === value.code)) {
                uniqueValues.push(value);
            }
        });

        // Сортировка по имени
        return uniqueValues.sort((a, b) => a.name.localeCompare(b.name));
    };

    // Обработка region
    const region = {
        name: 'Регіон',
        key: 'region',
        value: processAddressField('region')
    };

    // Обработка city
    const city = {
        name: 'Місто',
        key: 'city',
        value: processAddressField('city')
    };

    // Обработка area
    const area = {
        name: 'Район',
        key: 'area',
        value: processAddressField('area')
    };

    return { region, city, area };
});

const utilities = computed(() => {
    // Общая функция для обработки и исключения дубликатов на основе уникального поля
    const processUtilityField = (field) => {
        const values = storeCategories.properties
            .map(property => property.utilities[field])
            .filter(value => value !== null && value !== undefined); // Исключаем пустые значения

        // Убираем дубликаты по уникальному полю (например, 'code')
        const uniqueValues = [];
        values.forEach(value => {
            // Проверяем, что такого элемента еще нет в uniqueValues
            if (!uniqueValues.some(item => item.code === value.code)) {
                uniqueValues.push(value);
            }
        });

        // Сортировка значений
        return uniqueValues.sort((a, b) => a.name.localeCompare(b.name)); // Для строк сортировка по алфавиту
    };

    // Обработка utilities
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

onMounted(() => {
    console.log('properties', properties.value);
});

</script>
