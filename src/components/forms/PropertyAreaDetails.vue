<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'validation-change']);

const errors = ref({
    totalArea: '',
    livingArea: '',
    kitchenArea: '',
    landArea: ''
});

// Validation rules
const validateTotalArea = (value) => {
    if (!value && value !== 0) return "Загальна площа обов'язкова";
    if (value <= 0) return 'Загальна площа повинна бути більше 0';
    if (value > 1000) return 'Загальна площа не може перевищувати 1000 м²';
    return '';
};

const validateLivingArea = (value, totalArea) => {
    if (!value) return ''; // Living area is optional
    if (value <= 0) return 'Жила площа повинна бути більше 0';
    if (value >= totalArea) return 'Жила площа не може бути більше загальної площі';
    return '';
};

const validateKitchenArea = (value, totalArea, livingArea) => {
    if (!value) return ''; // Kitchen area is optional
    if (value <= 0) return 'Площа кухні повинна бути більше 0';
    if (value >= totalArea) return 'Площа кухні не може бути більше загальної площі';
    if (livingArea && value + livingArea > totalArea) {
        return 'Сума жилої площі та площі кухні не може перевищувати загальну площу';
    }
    return '';
};

const validate = () => {
    const { totalArea, livingArea, kitchenArea } = props.modelValue;

    errors.value = {
        totalArea: validateTotalArea(totalArea),
        livingArea: validateLivingArea(livingArea, totalArea),
        kitchenArea: validateKitchenArea(kitchenArea, totalArea, livingArea)
    };

    // Remove empty error messages
    Object.keys(errors.value).forEach((key) => {
        if (!errors.value[key]) {
            delete errors.value[key];
        }
    });

    // Emit validation state
    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

// Watch for changes in individual values
watch(
    () => props.modelValue.totalArea,
    () => validate()
);
watch(
    () => props.modelValue.livingArea,
    () => validate()
);
watch(
    () => props.modelValue.kitchenArea,
    () => validate()
);

watch(
    () => props.modelValue.landArea,
    () => validate()
);

// Export validation method for parent component
defineExpose({ validate });
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Площа(м²)</div>

        <div class="font-semibold text-md">
            <span>Загальна площа</span>
            <span class="ml-1 text-red-500">*</span>
        </div>
        <InputNumber v-model="modelValue.totalArea" showButtons :minFractionDigits="1" :maxFractionDigits="2" :class="{ 'p-invalid': errors.totalArea }" :min="0" fluid required />
        <small class="text-red-500" v-if="errors.totalArea">
            {{ errors.totalArea }}
        </small>

        <div class="font-semibold text-md">
            <span>Жила площа будинку</span>
            <span class="ml-1 text-red-500">*</span>
        </div>
        <InputNumber v-model="modelValue.livingArea" showButtons :minFractionDigits="1" :maxFractionDigits="2" :class="{ 'p-invalid': errors.livingArea }" :min="0" fluid />
        <small class="text-red-500" v-if="errors.livingArea">
            {{ errors.livingArea }}
        </small>

        <div class="font-semibold text-md">
            <span>Площа кухні</span>
            <span class="ml-1 text-red-500">*</span>
        </div>
        <InputNumber v-model="modelValue.kitchenArea" showButtons :minFractionDigits="1" :maxFractionDigits="2" :class="{ 'p-invalid': errors.kitchenArea }" :min="0" fluid />
        <small class="text-red-500" v-if="errors.kitchenArea">
            {{ errors.kitchenArea }}
        </small>

        <div class="font-semibold text-md">
            <span>Площа ділянки</span>
        </div>
        <InputNumber v-model="modelValue.landArea" showButtons :minFractionDigits="1" :maxFractionDigits="2" :class="{ 'p-invalid': errors.landArea }" :min="0" fluid />
        <small class="text-red-500" v-if="errors.landArea">
            {{ errors.landArea }}
        </small>
    </div>
</template>

<style scoped>
.p-invalid {
    border-color: #dc3545 !important;
}

.p-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.p-inputnumber.p-invalid .p-inputnumber-input {
    border-color: #dc3545 !important;
}
</style>
