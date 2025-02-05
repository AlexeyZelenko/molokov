<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Стан нерухомості *</div>
        <SelectButton
            v-model="modelValue.condition"
            :options="dropdowns.conditions"
            optionLabel="name"
            :class="{'p-invalid': errors.condition}"
            class="flex flex-col w-full"
            @change="validateFields"
        />
        <small class="text-red-500" v-if="errors.condition">{{ errors.condition }}</small>

        <div class="font-semibold text-xl">Тип будівлі *</div>
        <Select
            v-model="modelValue.buildingType"
            :options="dropdowns.buildingTypes"
            optionLabel="name"
            placeholder="Оберіть тип будівлі"
            :class="{'p-invalid': errors.buildingType}"
            @change="validateFields"
        />
        <small class="text-red-500" v-if="errors.buildingType">{{ errors.buildingType }}</small>

        <div class="font-semibold text-xl">Клас об'єкта *</div>
        <Select
            v-model="modelValue.objectClass"
            :options="dropdowns.objectClass"
            optionLabel="name"
            placeholder="Оберіть клас"
            :class="{'p-invalid': errors.objectClass}"
            @change="validateFields"
        />
        <small class="text-red-500" v-if="errors.objectClass">{{ errors.objectClass }}</small>

        <div class="font-semibold text-xl">Ремонт *</div>
        <Select
            v-model="modelValue.reconditioning"
            :options="dropdowns.reconditioning"
            optionLabel="name"
            placeholder="Оберіть тип ремонту"
            :class="{'p-invalid': errors.reconditioning}"
            @change="validateFields"
        />
        <small class="text-red-500" v-if="errors.reconditioning">{{ errors.reconditioning }}</small>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

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

const emit = defineEmits(['update:modelValue', 'validation-change']);

const errors = ref({});

const validateFields = () => {
    errors.value = {
        condition: !props.modelValue.condition ? "Стан нерухомості обов'язковий" : '',
        buildingType: !props.modelValue.buildingType ? "Тип будівлі обов'язковий" : '',
        objectClass: !props.modelValue.objectClass ? "Клас об'єкта обов'язковий" : '',
        reconditioning: !props.modelValue.reconditioning ? "Тип ремонту обов'язковий" : ''
    };

    Object.keys(errors.value).forEach(key => {
        if (!errors.value[key]) delete errors.value[key];
    });

    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);
    return isValid;
};

watch(() => props.modelValue, validateFields, { deep: true });

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
