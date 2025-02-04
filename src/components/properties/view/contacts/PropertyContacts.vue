<template>
    <Fluid class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white">
            <div class="card flex flex-col gap-2">
                <div class="font-semibold text-xl">Контакти ріелтора</div>
                <div>{{ creator?.username }}</div>
                <div v-for="phone in creator?.phone" :key="phone">
                    Телефон: {{ phone }}
                </div>
                <div v-if="creator?.message">
                    {{ creator?.message }}
                </div>
            </div>
        </div>

        <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white">
            <div class="card flex flex-col gap-2">
                <div class="font-semibold text-xl">Контакти власника / посередника</div>
                <div>{{ owner?.username }} - {{ typeOwner?.name }}</div>
                <div>Телефон: {{ owner?.phone }}</div>
                <div v-if="owner?.message">
                    {{ owner?.message }}
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
defineProps({
    creator: {
        type: Object,
        default: () => ({})
    },
    owner: {
        type: Object,
        default: () => ({})
    },
    typeOwner: {
        type: Object,
        default: null
    }
});
</script>
