<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Площа</div>

        <div class="font-semibold text-sm">Загальна площа *</div>
        <InputNumber
            v-model="modelValue.totalArea"
            showButtons
            :minFractionDigits="1"
            :maxFractionDigits="2"
            :class="{ 'p-invalid': errors.totalArea }"
            :min="0"
            fluid
            required
        />
        <small class="text-red-500" v-if="errors.totalArea">
            {{ errors.totalArea }}
        </small>
    </div>
</template>

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
});

// Validation rules
const validateTotalArea = (value) => {
    if (!value && value !== 0) return 'Загальна площа обов\'язкова';
    if (value <= 0) return 'Загальна площа повинна бути більше 0';
    if (value > 1000) return 'Загальна площа не може перевищувати 1000 м²';
    return '';
};

const validate = () => {
    const { totalArea, livingArea, kitchenArea } = props.modelValue;

    errors.value = {
        totalArea: validateTotalArea(totalArea),
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

// Watch for changes in individual values
watch(() => props.modelValue.totalArea, () => validate());

// Export validation method for parent component
defineExpose({ validate });
</script>

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
