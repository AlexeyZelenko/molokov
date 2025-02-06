<template>
    <div class="card flex flex-col gap-4">
        <label v-for="(field, key) in fields" :key="key" class="font-semibold text-xl">
            <p class="mb-2">{{ field.label }} *</p>
            <component
                :is="field.component"
                v-model="modelValue[field.code]"
                :options="dropdowns[key]"
                optionLabel="name"
                :placeholder="field.placeholder"
                :class="{'p-invalid': errors[field.code]}"
                class="w-full"
                size="small"
            />
            <small class="text-red-500" v-if="errors[field.code]">{{ errors[field.code] }}</small>
        </label>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';

const props = defineProps({
    modelValue: { type: Object, required: true },
    dropdowns: { type: Object, required: true }
});
const emit = defineEmits(['update:modelValue', 'validation-change']);
const errors = ref({});

const fields = computed(() => ({
    conditions: {
        label: "Стан нерухомості",
        component: SelectButton,
        code: 'condition'
    },
    buildingTypes: {
        label: "Тип будівлі",
        component: Select,
        placeholder: "Оберіть тип будівлі",
        code: 'buildingType'
    },
    objectClass: {
        label: "Клас об'єкта",
        component: Select,
        placeholder: "Оберіть клас",
        code: 'objectClass'
    },
    reconditioning: {
        label: "Ремонт",
        component: Select,
        placeholder: "Оберіть тип ремонту",
        code: 'reconditioning'
    }
}));

const validateFields = () => {
    errors.value = {};

    Object.entries(fields.value).forEach(([key, field]) => {
        if (!props.modelValue[field.code]) {
            errors.value[key] = `${field.label} обов'язковий`;
        }
    });

    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

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
