<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Поверховість</div>

        <div class="field">
            <div class="font-semibold text-sm mb-2">Поверх *</div>
            <InputNumber
                v-model="formData.floor"
                showButtons
                mode="decimal"
                :min="0"
                :class="{'p-invalid': errors.floor}"
                :placeholder="'Введіть поверх'"
                aria-label="Поверх"
                :tooltip="'Поверх не може перевищувати поверховість будівлі'"
                tooltipMode="top"
            />
            <small class="text-red-500" v-if="errors.floor">{{ errors.floor }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm mb-2">Кількість поверхів у приміщенні *</div>
            <InputNumber
                v-model="formData.totalFloorsBuilding"
                showButtons
                mode="decimal"
                :min="1"
                :class="{'p-invalid': errors.totalFloorsBuilding}"
                :placeholder="'Введіть поверховість будівлі'"
                aria-label="Поверховість будівлі"
            />
            <small class="text-red-500" v-if="errors.totalFloorsBuilding">{{ errors.totalFloorsBuilding }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm mb-2">Поверховість будівлі *</div>
            <InputNumber
                v-model="formData.totalFloors"
                showButtons
                mode="decimal"
                :min="1"
                :class="{'p-invalid': errors.totalFloors}"
                :placeholder="'Введіть кількість поверхів'"
                aria-label="Кількість поверхів у приміщенні"
                :tooltip="'Не може перевищувати поверховість будівлі'"
                tooltipMode="top"
            />
            <small class="text-red-500" v-if="errors.totalFloors">{{ errors.totalFloors }}</small>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({
            floor: null,
            totalFloorsBuilding: null,
            totalFloors: null
        })
    }
});

const emit = defineEmits(['update:modelValue', 'validation-change']);

// Реактивные данные формы
const formData = ref({
    floor: props.modelValue.floor ?? null,
    totalFloorsBuilding: props.modelValue.totalFloorsBuilding ?? null,
    totalFloors: props.modelValue.totalFloors ?? null
});

// Объект для хранения ошибок
const errors = ref({
    floor: '',
    totalFloorsBuilding: '',
    totalFloors: ''
});

// Правила валидации
const validationRules = {
    floor: (value, data) => {
        if (value === null || value === undefined) {
            return "Поверх обов'язковий";
        }
        if (value < 0) {
            return "Не може бути від'ємним";
        }
        if (data.totalFloorsBuilding && value > data.totalFloorsBuilding) {
            return "Не може перевищувати поверховість будівлі";
        }
        return '';
    },
    totalFloorsBuilding: (value) => {
        if (value === null || value === undefined) {
            return "Поверховість будівлі обов'язкова";
        }
        if (value < 1) {
            return "Має бути більше нуля";
        }
        return '';
    },
    totalFloors: (value, data) => {
        if (value === null || value === undefined) {
            return "Кількість поверхів у приміщенні обов'язкова";
        }
        if (value < 1) {
            return "Має бути більше нуля";
        }
        if (data.totalFloorsBuilding && value > data.totalFloorsBuilding) {
            return "Не може перевищувати поверховість будівлі";
        }
        return '';
    }
};

// Функция валидации одного поля
const validateField = (fieldName) => {
    const value = formData.value[fieldName];
    errors.value[fieldName] = validationRules[fieldName](value, formData.value);
    return !errors.value[fieldName];
};

// Валидация всех полей
const validate = () => {
    const validationResults = Object.keys(validationRules).map(field => validateField(field));
    const isValid = validationResults.every(Boolean);
    emit('validation-change', isValid);
    return isValid;
};

// Следим за изменениями формы и обновляем родительский компонент
watch(formData, (newValue) => {
    emit('update:modelValue', { ...newValue });
}, { deep: true });

// Экспортируем методы для родительского компонента
defineExpose({
    validate,
    reset: () => {
        formData.value = {
            floor: null,
            totalFloorsBuilding: null,
            totalFloors: null
        };
        errors.value = {
            floor: '',
            totalFloorsBuilding: '',
            totalFloors: ''
        };
    }
});
</script>

<style scoped>
.field {
    margin-bottom: 1rem;
}

.p-invalid {
    border-color: #dc3545 !important;
}
</style>
