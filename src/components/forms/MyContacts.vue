<script setup>
import { defineProps } from 'vue';

defineProps({
    contacts: {
        type: Object,
        required: false,
        default: () => ({
            name: '',
            agency: '',
            phones: []
        })
    }
});
</script>

<template>
    <div class="grid grid-cols-1 ms:grid-cols-2 gap-4 md:gap-8 w-full">
        <div class="card flex flex-col gap-4 w-full h-full">
            <div class="font-semibold text-xl mb-2">Мої контакти</div>

            <div class="font-semibold text-md">Ім'я</div>
            <InputText :value="contacts?.name" placeholder="Username" disabled />

            <div v-if="contacts?.agency" class="w-full">
                <div class="font-semibold text-md mb-4">Агенція</div>
                <InputText :value="contacts?.agency" disabled class="w-full" />
            </div>

            <div class="font-semibold text-md">Телефони</div>
            <div v-for="(phone, index) in contacts?.phones" :key="index" class="mb-2 w-full">
                <InputText :value="phone" disabled placeholder="Телефон" class="w-full" />
            </div>
            <!-- Спейсер для выравнивания высоты -->
            <div class="flex-grow"></div>
        </div>
    </div>
</template>
