<template>
    <div class="card flex flex-col gap-2 shadow-lg">
        <div class="font-semibold text-xl">Розташування</div>
        <div class="font-bold text-sm">Область / Місто</div>
        <div>{{ address?.region?.name }} / {{ address?.city?.name || address?.city }}</div>

        <div v-if="address.area?.name">
            <span class="font-bold text-sm">Район: </span>
            <span>{{ address?.area?.name }}</span>
        </div>

        <div v-if="address?.street">
            <span class="font-bold text-sm">Вулиця: </span>
            <span>{{ address?.street }}</span>
        </div>

    </div>
</template>

<script setup>
defineProps({
    address: {
        type: Object,
        required: true,
        validator: (value) => {
            return value.city && value.street;
        }
    }
});
</script>
