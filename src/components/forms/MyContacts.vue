<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div class="card flex flex-col gap-4 h-full">
            <div class="font-semibold text-xl mb-2">Мої контакти</div>

            <div class="font-semibold text-sm">Ім'я</div>
            <InputText
                :value="contacts?.name"
                placeholder="Username"
                disabled
            />

            <div v-if="contacts?.agency" class="w-full">
                <div class="font-semibold text-sm mb-1">Агенція</div>
                <InputText
                    :value="contacts?.agency"
                    disabled
                    class="w-full"
                />
            </div>

            <div class="font-semibold text-sm">Телефони</div>
            <div
                v-for="(phone, index) in contacts?.phones"
                :key="index"
                class="mb-2 w-full"
            >
                <InputText
                    :value="phone"
                    disabled
                    placeholder="Телефон"
                    class="w-full"
                />
            </div>
            <!-- Спейсер для выравнивания высоты -->
            <div class="flex-grow"></div>
        </div>

        <!-- Используем h-full для второй карточки -->
        <div class="card flex flex-col gap-4 h-full">
            <div class="font-semibold text-xl mb-2">Додатково</div>
            <Textarea
                v-model="message"
                placeholder="Повідомлення"
                :autoResize="true"
                rows="5"
                cols="30"
                class="flex-grow"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    contacts: {
        type: Object,
        required: false,
        default: () => ({
            name: '',
            agency: '',
            phones: []
        })
    },
    modelValue: {
        type: Object,
        required: false,
        default: () => ({
            creator: {
                message: ''
            }
        })
    }
});

const emit = defineEmits(['update:modelValue']);

// Безопасное вычисление `message`
const message = computed({
    get: () => props.modelValue?.creator?.message || '',
    set: (newMessage) => {
        emit('update:modelValue', {
            ...props.modelValue,
            creator: {
                ...(props.modelValue?.creator || {}),
                message: newMessage
            }
        });
    }
});
</script>
