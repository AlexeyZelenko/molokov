<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Кількість кімнат</div>

        <template v-for="(label, key) in roomLabels" :key="key">
            <div class="font-semibold text-sm">{{ label }} *</div>
            <InputNumber
                v-model="modelValue.rooms[key]"
                showButtons
                mode="decimal"
                :class="{ 'p-invalid': showErrors && errors[key] }"
                :min="0"
            />
            <small class="text-red-500" v-if="showErrors && errors[key]">{{ errors[key] }}</small>
        </template>

        <div class="font-semibold text-xl mt-4">Планування</div>

        <div class="font-semibold text-sm">Планування квартири *</div>
        <Select
            v-model="modelValue.planning"
            :options="dropdowns.planning"
            optionLabel="name"
            placeholder="Оберіть планування"
            :class="{ 'p-invalid': showErrors && errors.planning }"
        />
        <small class="text-red-500" v-if="showErrors && errors.planning">{{ errors.planning }}</small>

        <div class="font-semibold text-sm">Планування санвузла *</div>
        <Select
            v-model="modelValue.bathroom"
            :options="dropdowns.bathroom"
            optionLabel="name"
            placeholder="Оберіть планування"
            :class="{ 'p-invalid': showErrors && errors.bathroom }"
        />
        <small class="text-red-500" v-if="showErrors && errors.bathroom">{{ errors.bathroom }}</small>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    dropdowns: {
        type: Object,
        required: true
    }
});

const roomLabels = {
    all: 'Кількість кімнат',
    bedrooms: 'Кількість спалень',
    bathrooms: 'Кількість ванних кімнат',
    kitchens: 'Кількість кухонь'
};

const validationRules = {
    all: (value) => value == null ? "Кількість кімнат обов'язкова" : value < 0 ? "Не може бути від'ємним" : '',
    bedrooms: (value, data) => value == null ? "Кількість спалень обов'язкова" : value < 0 ? "Не може бути від'ємним" : (data.all && value > data.all) ? "Не може перевищувати загальну кількість кімнат" : '',
    bathrooms: (value) => value == null ? "Кількість ванних кімнат обов'язкова" : value < 0 ? "Не може бути від'ємним" : '',
    kitchens: (value) => value == null ? "Кількість кухонь обов'язкова" : value < 0 ? "Не може бути від'ємним" : '',
    planning: (value) => !value ? "Планування квартири обов'язкове" : '',
    bathroom: (value) => !value ? "Планування санвузла обов'язкове" : ''
};

const showErrors = ref(false);

const errors = computed(() => {
    const validationData = { ...props.modelValue.rooms, planning: props.modelValue.planning, bathroom: props.modelValue.bathroom };
    return Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = validationRules[key](validationData[key], validationData);
        return acc;
    }, {});
});

const validateForm = () => {
    showErrors.value = true;
    return Object.values(errors.value).every(error => !error);
};

defineExpose({ validate: validateForm });
</script>
