<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';

const props = defineProps({
    modelValue: { type: Object, required: true },
    dropdowns: { type: Object, required: true }
});
const emit = defineEmits(['update:modelValue', 'validation-change']);
const errors = ref({});

const fields = computed(() => ({
    appointment: {
        label: 'Призначення ділянки',
        component: Select,
        placeholder: 'Оберіть тип призначення ділянки',
        code: 'buildingType'
    }
}));

// Watch for modelValue changes to validate in real-time
watch(
    () => props.modelValue,
    () => {
        validateAllFields();
    },
    { deep: true }
);

// Validate a specific field
const validateField = (code) => {
    if (!props.modelValue[code]) {
        const field = Object.values(fields.value).find((f) => f.code === code);
        errors.value[code] = `${field.label} обов'язкове`;
    } else {
        delete errors.value[code];
    }

    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

// Validate all fields at once
const validateAllFields = () => {
    errors.value = {};

    Object.values(fields.value).forEach((field) => {
        if (!props.modelValue[field.code]) {
            errors.value[field.code] = `${field.label} обов'язковий`;
        }
    });

    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

// Initial validation on mount
onMounted(() => {
    validateAllFields();
});

defineExpose({ validate: validateAllFields });
</script>

<template>
    <div class="card flex flex-col gap-4">
        <label v-for="(field, key) in fields" :key="key" class="font-semibold text-xl">
            <p class="mb-2">
                <span>{{ field.label }}</span>
                <span class="ml-1 text-red-500">*</span>
            </p>
            <component
                :is="field.component"
                v-model="modelValue[field.code]"
                :options="dropdowns[key]"
                optionLabel="name"
                :placeholder="field.placeholder"
                :class="{ 'p-invalid': errors[field.code] }"
                class="w-full"
                size="small"
                @change="validateField(field.code)"
                @blur="validateField(field.code)"
            />
            <small class="text-red-500" v-if="errors[field.code]">{{ errors[field.code] }}</small>
        </label>
    </div>
</template>

<style scoped>
.p-invalid {
    border-color: #dc3545;
}

.p-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
