<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Поверховість</div>

        <template v-for="(label, key) in floorLabels" :key="key">
            <div class="font-semibold text-md">
                <span>{{ label }}</span>
                <span class="ml-1 text-red-500">*</span>
            </div>
            <InputNumber
                :model-value="props.modelValue[key]"
                @update:model-value="updateValue(key, $event)"
                showButtons
                mode="decimal"
                :min="minValues[key]"
                :class="{ 'p-invalid': showErrors && errors[key] }"
                :placeholder="placeholders[key]"
            />
            <small class="text-red-500" v-if="showErrors && errors[key]">{{ errors[key] }}</small>
        </template>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const floorLabels = {
    totalFloorsBuilding: 'Кількість поверхів будівлі'
};

const placeholders = {
    totalFloorsBuilding: 'Введіть кількість поверхів будівлі'
};

const minValues = {
    totalFloorsBuilding: 1
};

const errors = ref({
    totalFloorsBuilding: ''
});

const showErrors = ref(false);

const validate = () => {
    // Очищаем предыдущие ошибки
    errors.value.totalFloorsBuilding = '';

    // Валидация количества этажей
    if (props.modelValue.totalFloorsBuilding < 1) {
        errors.value.totalFloorsBuilding = "Має бути більше нуля";
    }

    showErrors.value = true;
    return !Object.values(errors.value).some(Boolean);
};

const updateValue = (key, value) => {
    emit('update:modelValue', {...props.modelValue, [key]: value});
};

defineExpose({validate});
</script>

<style scoped>
.p-invalid {
    border-color: #dc3545 !important;
}
</style>
