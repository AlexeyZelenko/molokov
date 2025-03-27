<template>
    <div class="flex flex-col gap-2">
        <div class="font-bold text-xl">Розташування</div>
        <div class="font-bold text-md">
            <span>Область / </span>
            <span v-if="address?.city.RegionsDescription">Район / </span>
            <span>{{ address?.city.SettlementTypeDescription || 'Населений пункт' }}</span>            
        </div>
        <div>
            <span>{{ address?.region?.name }} / </span>
            <span v-if="address?.city.RegionsDescription"> {{ address?.city.RegionsDescription }} / </span> 
            <sapn>{{ address?.city.Description || address?.city?.name || address?.city }}</sapn>
        </div>

        <div v-if="address.area?.name">
            <span class="font-bold text-md">Район: </span>
            <span>{{ address?.area?.name }}</span>
        </div>

        <div v-if="address?.street">
            <span class="font-bold text-md">Вулиця: </span>
            <span>{{ address?.street }}</span>
        </div>

    </div>
</template>

<script setup>
defineProps({
    address: {
        type: Object,
        required: true
    }
});
</script>
