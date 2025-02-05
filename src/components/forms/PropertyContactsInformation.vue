<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Інформація про власника</div>

        <div class="font-semibold text-sm">Тип власника</div>
        <Select
            v-model="modelValue.typeOwner"
            :options="dropdowns.typeOwner"
            optionLabel="name"
            placeholder="Виберіть тип власника"
            :class="{ 'p-invalid': errors.typeOwner }"
            required
        />
        <small class="text-red-500" v-if="errors.typeOwner">
            {{ errors.typeOwner }}
        </small>

        <div class="font-semibold text-sm">Ім'я власника</div>
        <InputText
            v-model="modelValue.owner.username"
            placeholder="Username"
            :class="{ 'p-invalid': errors.username }"
            required
        />
        <small class="text-red-500" v-if="errors.username">
            {{ errors.username }}
        </small>

        <div class="font-semibold text-sm">Телефон</div>
        <InputMask
            v-model="modelValue.owner.phone"
            mask="+38(0**) 999-99-99"
            placeholder="+38(999) 999-9999"
            :class="{ 'p-invalid': errors.phone }"
            required
        />
        <small class="text-red-500" v-if="errors.phone">
            {{ errors.phone }}
        </small>

        <div class="font-semibold text-sm">Додатково</div>
        <Textarea
            v-model="modelValue.owner.message"
            placeholder="Ваше повідомлення"
            :autoResize="true"
            :class="{ 'p-invalid': errors.message }"
        />
        <small class="text-red-500" v-if="errors.message">
            {{ errors.message }}
        </small>
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

const errors = ref({
    typeOwner: '',
    username: '',
    phone: '',
    message: ''
});

const validateFields = () => {
    errors.value = {
        typeOwner: !props.modelValue.typeOwner ? 'Тип власника обов\'язковий' : '',
        username: !props.modelValue.owner.username ? 'Ім\'я власника обов\'язкове' : '',
        phone: !props.modelValue.owner.phone ? 'Телефон обов\'язковий' : '',
        message: ''
    };

    Object.keys(errors.value).forEach(key => {
        if (!errors.value[key]) {
            delete errors.value[key];
        }
    });

    const isValid = Object.keys(errors.value).length === 0;
    emit('validation-change', isValid);

    return isValid;
};

watch(() => props.modelValue, () => {
    validateFields();
}, { deep: true });

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
