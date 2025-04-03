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
    floor: 'Поверх',
    totalFloorsBuilding: 'Кількість поверхів у приміщенні',
    totalFloors: 'Поверховість будівлі'
};

const placeholders = {
    floor: 'Введіть поверх',
    totalFloorsBuilding: 'Введіть поверховість приміщення',
    totalFloors: 'Введіть кількість поверхів'
};

const minValues = {
    floor: 0,
    totalFloorsBuilding: 1,
    totalFloors: 1
};

const errors = ref({
    floor: '',
    totalFloorsBuilding: '',
    totalFloors: ''
});

const showErrors = ref(false);

const validate = () => {
    errors.value.floor = props.modelValue.floor === null || props.modelValue.floor < 0 ? "Не може бути від'ємним" : props.modelValue.floor > props.modelValue.totalFloors ? 'Не може перевищувати поверховість будівлі' : '';

    errors.value.totalFloorsBuilding = props.modelValue.totalFloorsBuilding < 1 ? 'Має бути більше нуля' : props.modelValue.totalFloorsBuilding > props.modelValue.totalFloors ? 'Не може перевищувати поверховість будівлі' : '';

    errors.value.totalFloors = props.modelValue.totalFloors < 1 ? 'Має бути більше нуля' : '';

    showErrors.value = true;
    return !Object.values(errors.value).some(Boolean);
};

const updateValue = (key, value) => {
    emit('update:modelValue', { ...props.modelValue, [key]: value });
};

defineExpose({ validate });
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Поверховість</div>

        <template v-for="(label, key) in floorLabels" :key="key">
            <div class="font-semibold text-md">
                <span>{{ label }}</span>
                <span class="ml-1 text-red-500">*</span>
            </div>
            <InputNumber :model-value="props.modelValue[key]" @update:model-value="updateValue(key, $event)" showButtons mode="decimal" :min="minValues[key]" :class="{ 'p-invalid': showErrors && errors[key] }" :placeholder="placeholders[key]" />
            <small class="text-red-500" v-if="showErrors && errors[key]">{{ errors[key] }}</small>
        </template>
    </div>
</template>

<style scoped>
.p-invalid {
    border-color: #dc3545 !important;
}
</style>
