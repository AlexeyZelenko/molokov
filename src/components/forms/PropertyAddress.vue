<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Розташування</div>

        <div class="font-semibold text-md">
            <span>Область</span>
            <span class="ml-1 text-red-500">*</span>
        </div>
        <Select
            v-model="modelValue.region"
            :options="dropdowns.regions"
            optionLabel="name"
            placeholder="Select"
            :class="{ 'p-invalid': errors.region }"
            required
            @change="changeRegion"
        />
        <small class="text-red-500" v-if="errors.region">
            {{ errors.region }}
        </small>

        <div class="font-semibold text-md">
            <span>Місто</span>
            <span class="ml-1 text-red-500">*</span>
        </div>

        <p v-if="modelValue.city?.Description" class="text-cyan-600 font-semibold">
            Вибране місто: {{ modelValue.city.Description.toUpperCase() }}
        </p>

        <div class="mb-6">
            <InputText
                v-model="searchQuery"
                placeholder="Пошук міста"
                class="w-full mt-1"
                :class="{ 'p-invalid': errors.city }"
            />
            <ul v-if="filteredCities.length" class="mt-2 bg-gray-100 rounded-lg shadow-md divide-y">
                <li v-for="city in filteredCities" :key="city.Ref"
                    @click="selectCity(city)"
                    class="p-2 cursor-pointer hover:bg-blue-100">
                    <span>{{ city.Description }}</span>
                    <span v-if="city.RegionsDescription">({{ city.RegionsDescription }} р-н)</span>
                </li>
            </ul>
            <p v-if="!modelValue.region" class="mt-1 text-grey-600 text-sm">виберіть спочатку область</p>
        </div>

        <div class="font-semibold text-md">Вулиця</div>
        <InputText
            v-model="modelValue.street"
            placeholder="Вулиця"
            name="street"
        />

        <template v-if="modelValue.city?.Description === 'Черкаси'">
            <div class="font-semibold text-md">Мікрорайон міста Черкаси</div>
            <Select
                v-model="modelValue.area"
                :options="dropdowns.areas"
                optionLabel="name"
                placeholder="Select"
                :class="{ 'p-invalid': errors.area }"
                required
            />
            <small class="text-red-500" v-if="errors.area">
                {{ errors.area }}
            </small>
        </template>

        <MapWithMarkerEdit
            v-if="modelValue.city?.Description === 'Черкаси' && modelValue.area.code"
            :property="property"
            :marker="property.address.markerPosition"
            v-model:marker="property.address.markerPosition"
        />
        <VueLeafle
            v-else-if="modelValue.region && modelValue.city?.Description !== 'Черкаси' && modelValue.city.Description"
            :property="property"
            :centerMap="centerMap"
            :marker="property.address.markerPosition"
            v-model:marker="property.address.markerPosition"
        />
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import MapWithMarkerEdit from "@/components/maps/MapWithMarkerEdit.vue";
import VueLeafle from "@/components/maps/VueLeafle.vue";
import {getSettlements} from '@/services/novaPoshtaService';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    dropdowns: {
        type: Object,
        required: true
    },
    property: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'validation-change']);

const errors = ref({
    region: '',
    city: '',
    area: ''
});

const changeRegion = () => {
    props.modelValue.area = {
        code: null,
        name: null
    };
    props.modelValue.street = "";
    props.modelValue.city = {
        code: null, name: null
    };
    props.modelValue.markerPosition = [];

};

const searchQuery = ref('');
const selectedSettlement = ref(null);
const citiesNova = ref([]);
const centerMap = ref(null);
const selectCity = (city) => {
    console.log(city);
    centerMap.value = [Number(city.Latitude), Number(city.Longitude)];
    props.modelValue.city = city;
    selectedSettlement.value = city;
    searchQuery.value = '';
};
const filteredCities = computed(() => {
    if(!props.modelValue.region) {
        return [];
    }
    return citiesNova.value.filter(city =>
        city.Description.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        city.AreaDescription.toLowerCase() === props.modelValue.region?.name.toLowerCase()
    );
});

watch(searchQuery, async () => {
    if(!props.modelValue.region) {

        return;
    }
    if (!searchQuery.value) {
        citiesNova.value = [];
        return;
    }

    try {
        citiesNova.value = await getSettlements({FindByString: searchQuery.value});
    } catch (error) {
        console.error("Ошибка поиска городов:", error);
        citiesNova.value = [];
    }
});

// Validation rules
const validateFields = () => {
    errors.value = {
        region: !props.modelValue.region ? 'Область обов\'язкова' : '',
        city: !props.modelValue.city ? 'Місто обов\'язкове' : '',
        street: !props.modelValue.street ? 'Вулиця обов\'язкова' : '',
        area: props.modelValue.city?.code === '1' && !props.modelValue.area ? 'Мікрорайон обов\'язковий' : ''
    };

    // Remove empty error messages
    Object.keys(errors.value).forEach(key => {
        if (!errors.value[key]) {
            delete errors.value[key];
        }
    });

    // Emit validation state
    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

// Watch for changes in modelValue and validate
watch(() => props.modelValue, () => {
    validateFields();
}, { deep: true });

// Export validateFields for parent component use
defineExpose({ validate: validateFields });
</script>

<style scoped>
.p-invalid {
    border-color: #dc3545;
}

.p-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
