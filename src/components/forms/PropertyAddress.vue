<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Розташування</div>

        <div class="font-semibold text-sm">Область *</div>
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

        <div class="font-semibold text-sm">Місто  *</div>
        <template v-if="modelValue.region?.code === 'CHK'">
            <Select
                v-model="modelValue.city"
                :options="dropdowns.cities"
                optionLabel="name"
                placeholder="Виберіть місто"
                :class="{ 'p-invalid': errors.city }"
                required
            />
            <small class="text-red-500" v-if="errors.city">
                {{ errors.city }}
            </small>
        </template>
        <template v-else-if="modelValue.region?.code !== 'CHK'">
            <InputText
                v-model="modelValue.city.name"
                placeholder="Місто"
                :class="{ 'p-invalid': errors.city }"
                required
            />
            <small class="text-red-500" v-if="errors.city">
                {{ errors.city }}
            </small>
        </template>

        <div class="font-semibold text-sm">Вулиця</div>
        <InputText
            v-model="modelValue.street"
            placeholder="Вулиця"
        />

        <template v-if="modelValue.city?.code === '1'">
            <div class="font-semibold text-sm">Мікрорайон міста Черкаси</div>
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
            v-if="modelValue.city?.code === '1' && modelValue.area.code"
            :property="property"
            :marker="property.address.markerPosition"
            v-model:marker="property.address.markerPosition"
        />
        <VueLeafle
            v-else-if="modelValue.city?.code !== '1'"
            :property="property"
            :marker="property.address.markerPosition"
            v-model:marker="property.address.markerPosition"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import MapWithMarkerEdit from "@/components/maps/MapWithMarkerEdit.vue";
import VueLeafle from "@/components/maps/VueLeafle.vue";

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
    props.modelValue.city = "";
    props.modelValue.markerPosition = [];

};

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
