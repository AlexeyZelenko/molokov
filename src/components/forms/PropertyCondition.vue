<template>
    <div class="card flex flex-col gap-4">
        <div class="field gap-4">
            <div class="font-semibold text-xl mb-4">Стан нерухомості *</div>
            <SelectButton
                name="condition"
                v-model="formData.condition"
                :options="dropdowns.conditions"
                optionLabel="name"
                :class="{'p-invalid': errors.condition}"
                class="flex flex-col w-full"
                @change="handleValidation('condition')"
            />
            <small class="p-error" v-if="errors.condition">{{ errors.condition }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-xl mb-4">Тип будівлі *</div>
            <Select
                name="buildingType"
                v-model="formData.buildingType"
                :options="dropdowns.buildingTypes"
                optionLabel="name"
                placeholder="Оберіть тип будівлі"
                :class="{'p-invalid': errors.buildingType}"
                @change="handleValidation('buildingType')"
            />
            <small class="p-error" v-if="errors.buildingType">{{ errors.buildingType }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-xl mb-4">Клас об'єкта *</div>
            <Select
                name="objectClass"
                v-model="formData.objectClass"
                :options="dropdowns.objectClass"
                optionLabel="name"
                placeholder="Оберіть клас"
                :class="{'p-invalid': errors.objectClass}"
                @change="handleValidation('objectClass')"
            />
            <small class="p-error" v-if="errors.objectClass">{{ errors.objectClass }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-xl mb-4">Ремонт *</div>
            <Select
                name="reconditioning"
                v-model="formData.reconditioning"
                :options="dropdowns.reconditioning"
                optionLabel="name"
                placeholder="Оберіть тип ремонту"
                :class="{'p-invalid': errors.reconditioning}"
                @change="handleValidation('reconditioning')"
            />
            <small class="p-error" v-if="errors.reconditioning">{{ errors.reconditioning }}</small>
        </div>
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

const formData = ref({ ...props.modelValue });
const errors = ref({});

const validationRules = {
    condition: (value) => {
        if (!value) {
            return "Стан нерухомості обов'язковий";
        }
        return '';
    },
    buildingType: (value) => {
        if (!value) {
            return "Тип будівлі обов'язковий";
        }
        return '';
    },
    objectClass: (value) => {
        if (!value) {
            return "Клас об'єкта обов'язковий";
        }
        return '';
    },
    reconditioning: (value) => {
        if (!value) {
            return "Тип ремонту обов'язковий";
        }
        return '';
    }
};

const handleValidation = (field) => {
    if (field) {
        // Validate single field
        errors.value[field] = validationRules[field](formData.value[field]);
    } else {
        // Validate all fields
        Object.keys(validationRules).forEach(key => {
            errors.value[key] = validationRules[key](formData.value[key]);
        });
    }

    const isValid = Object.values(errors.value).every(error => !error);
    emit('validation-change', isValid);
    return isValid;
};

// Add method for external validation
const validateAll = () => {
    return handleValidation();
};

// Make validateAll method available to parent components
defineExpose({
    validateAll
});

watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
}, {deep: true});
</script>
