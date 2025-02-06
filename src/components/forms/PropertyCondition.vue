<template>
    <div class="card flex flex-col gap-4">
        <label v-for="(field, key) in fields" :key="key" class="font-semibold text-xl">
            <p class="mb-2">{{ field.label }} *</p>
            <component
                :is="field.component"
                v-model="modelValue[key]"
                :options="dropdowns[key]"
                optionLabel="name"
                :placeholder="field.placeholder"
                :class="{'p-invalid': errors[key]}"
                class="w-full"
                size="small"
            />
            <small class="text-red-500" v-if="errors[key]">{{ errors[key] }}</small>
        </label>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import SelectButton from 'primevue/selectbutton';
import Select from 'primevue/select';

const props = defineProps({
    modelValue: { type: Object, required: true },
    dropdowns: { type: Object, required: true }
});
const emit = defineEmits(['update:modelValue', 'validation-change']);
const errors = ref({});

const fields = computed(() => ({
    conditions: { label: "Стан нерухомості", component: SelectButton },
    buildingTypes: { label: "Тип будівлі", component: Select, placeholder: "Оберіть тип будівлі" },
    objectClass: { label: "Клас об'єкта", component: Select, placeholder: "Оберіть клас" },
    reconditioning: { label: "Ремонт", component: Select, placeholder: "Оберіть тип ремонту" }
}));

const validateFields = () => {
    errors.value = Object.keys(fields.value).reduce((acc, key) => {
        if (!props.modelValue[key]) {
            acc[key] = `${fields.value[key].label} обов'язковий`;
        }
        return acc;
    }, {});

    emit('validation-change', Object.keys(errors.value).length === 0);

    return Object.keys(errors.value).length === 0;
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
