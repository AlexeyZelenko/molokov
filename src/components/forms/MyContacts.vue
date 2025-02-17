<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Мої контакти</div>

        <div class="font-semibold text-sm">Ім'я</div>
        <InputText
            :value="contacts?.name"
            placeholder="Username"
            disabled
        />

        <div class="font-semibold text-sm">Телефони</div>
        <div
            v-for="(phone, index) in contacts?.phones"
            :key="index"
            class="mb-2"
        >
            <InputText
                :value="phone"
                disabled
                placeholder="Телефон"
            />
        </div>

        <div class="font-semibold text-sm">Додатково</div>
        <Textarea
            v-model="modelValue.creator.message"
            placeholder="Ваш текст"
            :autoResize="true"
            rows="3"
            cols="30"
        />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    contacts: {
        type: Object,
        required: true
    },
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

watch(() => props.modelValue.creator.message, (newMessage) => {
    emit('update:modelValue', {
        ...props.modelValue,
        creator: {
            ...props.modelValue.creator,
            message: newMessage
        }
    });
});
</script>
