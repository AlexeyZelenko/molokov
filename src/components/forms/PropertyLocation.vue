<!-- PropertyLocation.vue -->
<template>
    <div>
        <div class="font-semibold text-sm">Область</div>
        <Select name="addressRegionProperty" v-model="property.address.region" :options="dropdowns.regions" optionLabel="name" placeholder="Select" required />
        <Message v-if="$form.addressRegionProperty?.invalid" severity="error" size="small" variant="simple">
            {{ $form.addressRegionProperty.error?.message }}
        </Message>

        <div class="font-semibold text-sm">Місто</div>
        <Select v-if="property.address.region && property.address.region.code === 'CHK'" v-model="property.address.city" :options="dropdowns.cities" optionLabel="name" placeholder="Виберіть місто" />
        <InputText v-else v-model="property.address.city" placeholder="Місто" />

        <div class="font-semibold text-sm">Вулиця</div>
        <InputText v-model="property.address.street" placeholder="Вулиця" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    property: Object,
    dropdowns: Object,
});
</script>
