<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Поверховість</div>

        <div class="field">
            <div class="font-semibold text-sm">Поверх *</div>
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
            <small class="p-error" v-if="errors.floor">{{ errors.floor }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm">Поверховість будівлі *</div>
            <InputNumber
                v-model="formData.totalFloorsBuilding"
                showButtons
                mode="decimal"
                :min="1"
                :class="{'p-invalid': errors.totalFloorsBuilding}"
                :placeholder="'Введіть поверховість будівлі'"
                aria-label="Поверховість будівлі"
            />
            <small class="p-error" v-if="errors.totalFloorsBuilding">{{ errors.totalFloorsBuilding }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm">Кількість поверхів у приміщенні *</div>
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
            <small class="p-error" v-if="errors.totalFloors">{{ errors.totalFloors }}</small>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

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
const validateAll = () => {
    const validationResults = Object.keys(validationRules).map(field => validateField(field));
    const isValid = validationResults.every(Boolean);
    emit('validation-change', isValid);
    return isValid;
};

// Вычисляемое свойство для проверки валидности всей формы
const isFormValid = computed(() => {
    return Object.values(errors.value).every(error => !error);
});

// Следим за изменениями данных формы
watchEffect(() => {
    // Валидируем поля при изменении любого значения
    validateAll();

    // Обновляем модель
    emit('update:modelValue', { ...formData.value });
});

// Делаем доступными методы для родительского компонента
defineExpose({
    validateAll,
    isFormValid,
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
    border-color: #ff4d4f !important;
}

.p-error {
    color: #ff4d4f;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Добавляем анимацию для сообщений об ошибках */
.p-error {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
}

.p-error:empty {
    opacity: 0;
}
</style>
