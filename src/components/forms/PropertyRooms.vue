<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Кількість кімнат</div>

        <div class="field">
            <div class="font-semibold text-sm">Кількість кімнат *</div>
            <InputNumber
                name="totalRooms"
                v-model="formData.rooms.all"
                showButtons
                mode="decimal"
                :class="{'p-invalid': errors.totalRooms}"
                @blur="handleValidation('totalRooms')"
                @input="handleValidation('totalRooms')"
                :min="0"
                :modelValue="formData.rooms.all ?? null"
            />
            <small class="p-error" v-if="errors.totalRooms">{{ errors.totalRooms }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm">Кількість спалень *</div>
            <InputNumber
                name="bedrooms"
                v-model="formData.rooms.bedrooms"
                showButtons
                mode="decimal"
                :class="{'p-invalid': errors.bedrooms}"
                @blur="handleValidation('bedrooms')"
                @input="handleValidation('bedrooms')"
                :min="0"
                :modelValue="formData.rooms.bedrooms ?? null"
            />
            <small class="p-error" v-if="errors.bedrooms">{{ errors.bedrooms }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm">Кількість ванних кімнат *</div>
            <InputNumber
                name="bathrooms"
                v-model="formData.rooms.bathrooms"
                showButtons
                mode="decimal"
                :class="{'p-invalid': errors.bathrooms}"
                @blur="handleValidation('bathrooms')"
                @input="handleValidation('bathrooms')"
                :min="0"
                :modelValue="formData.rooms.bathrooms ?? null"
            />
            <small class="p-error" v-if="errors.bathrooms">{{ errors.bathrooms }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm">Кількість кухонь *</div>
            <InputNumber
                name="kitchens"
                v-model="formData.rooms.kitchens"
                showButtons
                mode="decimal"
                :class="{'p-invalid': errors.kitchens}"
                @blur="handleValidation('kitchens')"
                @input="handleValidation('kitchens')"
                :min="0"
                :modelValue="formData.rooms.kitchens ?? null"
            />
            <small class="p-error" v-if="errors.kitchens">{{ errors.kitchens }}</small>
        </div>

        <div class="font-semibold text-xl mt-4">Планування</div>

        <div class="field">
            <div class="font-semibold text-sm">Планування квартири *</div>
            <Select
                name="planning"
                v-model="formData.planning"
                :options="dropdowns.planning"
                optionLabel="name"
                placeholder="Оберіть планування"
                :class="{'p-invalid': errors.planning}"
                @change="handleValidation('planning')"
            />
            <small class="p-error" v-if="errors.planning">{{ errors.planning }}</small>
        </div>

        <div class="field">
            <div class="font-semibold text-sm">Планування санвузла *</div>
            <Select
                name="bathroom"
                v-model="formData.bathroom"
                :options="dropdowns.bathroom"
                optionLabel="name"
                placeholder="Оберіть планування"
                :class="{'p-invalid': errors.bathroom}"
                @change="handleValidation('bathroom')"
            />
            <small class="p-error" v-if="errors.bathroom">{{ errors.bathroom }}</small>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

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

const formData = ref({
    rooms: {
        all: props.modelValue.rooms?.all ?? null,
        bedrooms: props.modelValue.rooms?.bedrooms ?? null,
        bathrooms: props.modelValue.rooms?.bathrooms ?? null,
        kitchens: props.modelValue.rooms?.kitchens ?? null
    },
    planning: props.modelValue.planning ?? null,
    bathroom: props.modelValue.bathroom ?? null
});

const errors = ref({});

const validationRules = {
    totalRooms: (value) => {
        if (value === null || value === undefined) {
            return "Кількість кімнат обов'язкова";
        }
        if (value < 0) {
            return "Не може бути від'ємним";
        }
        return '';
    },
    bedrooms: (value, data) => {
        if (value === null || value === undefined) {
            return "Кількість спалень обов'язкова";
        }
        if (value < 0) {
            return "Не може бути від'ємним";
        }
        if (typeof data.rooms.all === 'number' && value > data.rooms.all) {
            return "Не може перевищувати загальну кількість кімнат";
        }
        return '';
    },
    bathrooms: (value) => {
        if (value === null || value === undefined) {
            return "Кількість ванних кімнат обов'язкова";
        }
        if (value < 0) {
            return "Не може бути від'ємним";
        }
        return '';
    },
    kitchens: (value) => {
        if (value === null || value === undefined) {
            return "Кількість кухонь обов'язкова";
        }
        if (value < 0) {
            return "Не може бути від'ємним";
        }
        return '';
    },
    planning: (value) => {
        if (!value) {
            return "Планування квартири обов'язкове";
        }
        return '';
    },
    bathroom: (value) => {
        if (!value) {
            return "Планування санвузла обов'язкове";
        }
        return '';
    }
};

const handleValidation = (field) => {
    const validationData = {
        totalRooms: formData.value.rooms.all,
        bedrooms: formData.value.rooms.bedrooms,
        bathrooms: formData.value.rooms.bathrooms,
        kitchens: formData.value.rooms.kitchens,
        planning: formData.value.planning,
        bathroom: formData.value.bathroom
    };

    if (field) {
        const value = validationData[field];
        errors.value[field] = validationRules[field](value, formData.value);
    } else {
        Object.keys(validationRules).forEach(key => {
            const value = validationData[key];
            errors.value[key] = validationRules[key](value, formData.value);
        });
    }

    const isValid = Object.values(errors.value).every(error => !error);
    emit('validation-change', isValid);
    return isValid;
};

const validateAll = () => {
    return handleValidation();
};

defineExpose({
    validateAll
});

watch(formData, (newValue) => {
    emit('update:modelValue', {
        rooms: newValue.rooms,
        planning: newValue.planning,
        bathroom: newValue.bathroom
    });
}, { deep: true });

</script>

<style scoped>
.p-error {
    color: #dc3545;
}

.p-invalid {
    border-color: #dc3545 !important;
}

.p-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}
</style>
