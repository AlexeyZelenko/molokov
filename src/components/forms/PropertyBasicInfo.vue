<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Тип нерухомості</div>
        <InputText
            id="categoryProperty"
            :value="selectedCategoryName"
            disabled
        />

        <div class="font-semibold text-xl">Мета використання</div>
        <Select
            v-model="modelValue.subcategory"
            :options="dropdowns.subcategory"
            optionLabel="name"
            placeholder="Select"
            :class="{ 'p-invalid': errors.subcategory }"
            required
            @change="handleSubcategoryChange"
        />
        <small class="text-red-500" v-if="errors.subcategory">
            {{ errors.subcategory }}
        </small>

        <div class="font-semibold text-xl">Назва</div>
        <FloatLabel>
            <InputText
                v-model="modelValue.title"
                :class="{ 'p-invalid': errors.title }"
                required
            />
            <label>Назва оголошення</label>
        </FloatLabel>
        <small class="text-red-500" v-if="errors.title">
            {{ errors.title }}
        </small>

        <div class="font-semibold text-xl">Вартість</div>
        <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <InputNumber
                v-model="modelValue.price"
                :class="{ 'p-invalid': errors.price }"
                showButtons
                mode="decimal"
                :min="0"
                required
            />
            <InputGroupAddon>.00</InputGroupAddon>
        </InputGroup>
        <small class="text-red-500" v-if="errors.price">
            {{ errors.price }}
        </small>
        <PriceConverter
            :price="modelValue.price"
            :subcategory="modelValue.subcategory"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PriceConverter from '@/components/price/PriceConverter.vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    dropdowns: {
        type: Object,
        required: true
    },
    selectedCategoryName: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'subcategory-change', 'validation-change']);

const errors = ref({
    subcategory: '',
    title: '',
    price: ''
});

// Валидация полей
const validateTitle = (value) => {
    if (!value) return 'Назва обов\'язкова';
    if (value.length < 3) return 'Назва повинна містити мінімум 3 символи';
    if (value.length > 100) return 'Назва не повинна перевищувати 100 символів';
    return '';
};

const validatePrice = (value) => {
    if (!value && value !== 0) return 'Вартість обов\'язкова';
    if (value < 0) return 'Вартість не може бути від\'ємною';
    if (value > 1000000000) return 'Вартість занадто велика';
    return '';
};

// Метод валидации, вызываемый из родителя
const validateFields = () => {
    errors.value = {
        subcategory: !props.modelValue.subcategory ? 'Мета використання обов\'язкова' : '',
        title: validateTitle(props.modelValue.title),
        price: validatePrice(props.modelValue.price)
    };

    // Убираем пустые ошибки
    Object.keys(errors.value).forEach(key => {
        if (!errors.value[key]) {
            delete errors.value[key];
        }
    });

    // Сообщаем родителю о результате валидации
    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

// Обработчик изменения подкатегории
const handleSubcategoryChange = () => {
    emit('subcategory-change', props.modelValue);
};

// Экспорт метода валидации, чтобы родитель мог его вызвать
defineExpose({ validate: validateFields });
</script>


<style scoped>
.p-invalid {
    border-color: #dc3545 !important;
}

.p-invalid:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.p-inputnumber.p-invalid .p-inputnumber-input {
    border-color: #dc3545 !important;
}

.p-float-label.p-invalid > label {
    color: #dc3545 !important;
}
</style>
