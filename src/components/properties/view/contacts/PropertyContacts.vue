<template>
    <Fluid class="grid grid-cols-1 gap-6 mt-8">
        <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white h-full">
            <div class="card flex flex-col gap-2">
                <div class="font-semibold text-xl">Контакти власника оголошення</div>
                <div>
                    <span class="text-md font-semibold mr-2">Ім'я:</span>
                    <span>{{ creator?.username }}</span>
                 </div>
                <div v-if="creator?.agency">
                    <span class="text-md font-semibold mr-2">Агенція: </span>
                    <span>{{ creator?.agency }}</span>
                </div>
                <div v-for="phone in creator?.phone" :key="phone">
                    <span class="text-md font-semibold mr-2">Телефон:</span>
                    <span>{{ phone }}</span>
                </div>
                <div v-if="creator?.message">
                    {{ creator?.message }}
                </div>
            </div>
        </div>

<!--        <div class="card flex flex-col gap-6 p-4 shadow-lg rounded-lg bg-white h-full">-->
<!--            <div class="card flex flex-col gap-2">-->
<!--                <div class="font-semibold text-xl">Контакти власника / посередника</div>-->
<!--                <div>{{ owner?.username }} - {{ typeOwner?.name }}</div>-->
<!--                <div>Телефон: {{ owner?.phone }}</div>-->
<!--                <div v-if="owner?.message">-->
<!--                    {{ owner?.message }}-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
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
